import { FlatPasuk } from '@/types/torah';
import { SearchFilters } from '@/types/search';

interface SearchMessage {
  pesukim: FlatPasuk[];
  query: string;
  filters: SearchFilters;
}

interface SearchMatch {
  pasuk: FlatPasuk;
  score: number;
  matches: string[];
}

const scoreMatch = (text: string, query: string): number => {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(' ').filter(Boolean);
  
  let score = 0;
  
  // Full match
  if (lowerText.includes(lowerQuery)) {
    score += 10;
  }
  
  // Each word match
  words.forEach(word => {
    if (lowerText.includes(word)) {
      score += 5;
      
      // Bonus for word at start of sentence
      if (lowerText.startsWith(word)) {
        score += 2;
      }
    }
  });
  
  return score;
};

const MAX_RESULTS = 50;

self.addEventListener('message', (e: MessageEvent<SearchMessage>) => {
  const { pesukim, query, filters } = e.data;
  
  if (!query.trim()) {
    self.postMessage([]);
    return;
  }
  
  const lowerQuery = query.toLowerCase();
  
  const results: SearchMatch[] = [];
  
  // Early exit optimization: stop when we have enough high-quality results
  for (const pasuk of pesukim) {
    let score = 0;
    const matches: string[] = [];

    // Apply sefer filter
    if (filters.sefer && pasuk.sefer !== filters.sefer) {
      continue;
    }

    // Apply parsha filter
    if (filters.parsha && pasuk.parsha_id !== filters.parsha) {
      continue;
    }

    // Apply perek filter
    if (filters.perek && pasuk.perek !== filters.perek) {
      continue;
    }
    
    // Search in pasuk text
    if (filters.searchType === "all" || filters.searchType === "pasuk") {
      const pasukScore = scoreMatch(pasuk.text, query);
      if (pasukScore > 0) {
        score += pasukScore;
        matches.push(pasuk.text);
      }
    }

    // Search in questions and perushim
    pasuk.content.forEach(content => {
      content.questions.forEach(question => {
        // Search in question
        if (filters.searchType === "all" || filters.searchType === "question") {
          const questionScore = scoreMatch(question.text, query);
          if (questionScore > 0) {
            score += questionScore;
            matches.push(question.text);
          }
        }

        // Search in perushim
        question.perushim.forEach(perush => {
          const mefareshMatch = !filters.mefaresh || perush.mefaresh === filters.mefaresh;
          if (mefareshMatch && (filters.searchType === "all" || filters.searchType === "perush")) {
            const perushScore = scoreMatch(perush.text, query);
            if (perushScore > 0) {
              score += perushScore;
              matches.push(perush.text);
            }
          }
        });
      });
    });
    
    if (score > 0) {
      results.push({ pasuk, score, matches });
    }
  }
  
  // Sort by score
  results.sort((a, b) => b.score - a.score);
  
  // Limit to MAX_RESULTS
  const limitedResults = results.slice(0, MAX_RESULTS);
  
  console.log(`Search for "${query}" found ${results.length} results (showing ${limitedResults.length})`);
  self.postMessage(limitedResults.map(r => r.pasuk));
});

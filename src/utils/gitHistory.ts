/**
 * Git History Service
 * מספק היסטוריית Git/GitHub עבור פאנל הפיתוח
 */

export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
  additions?: number;
  deletions?: number;
}

export interface GitBranch {
  name: string;
  current: boolean;
  lastCommit: string;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  untracked: string[];
  staged: string[];
}

/**
 * שליפת היסטוריית commits
 */
export async function fetchGitHistory(limit = 20): Promise<GitCommit[]> {
  try {
    // בפיתוח אמיתי, זה יקרא ל-API שמריץ git log
    // כרגע מחזיר מידע מדומה
    
    const mockCommits: GitCommit[] = [
      {
        hash: '961bd1e',
        message: '🚀 הוספת מערכת סינכרון אוטומטי וניהול גרסאות מלא',
        author: 'ticnutai',
        date: new Date().toISOString(),
        files: [
          '.github/workflows/auto-sync.yml',
          '.husky/pre-commit',
          '.husky/post-commit',
          'scripts/auto-commit.cjs',
          'scripts/version-info.cjs',
          'scripts/sync-github.cjs',
          'package.json',
          'GIT_SYNC_GUIDE.md',
          'QUICK_START.md',
          'GITHUB_AUTH_FIX.md'
        ],
        additions: 829,
        deletions: 152
      },
      {
        hash: '6f161c4',
        message: 'Initial commit from remix',
        author: 'yakovt1212',
        date: new Date(Date.now() - 86400000).toISOString(),
        files: [
          'README.md',
          'package.json',
          'src/App.tsx',
          'src/main.tsx'
        ],
        additions: 1250,
        deletions: 0
      }
    ];

    // סימולציה של קריאת רשת
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockCommits.slice(0, limit);
  } catch (error) {
    console.error('Error fetching git history:', error);
    return [];
  }
}

/**
 * שליפת סטטוס Git נוכחי
 */
export async function fetchGitStatus(): Promise<GitStatus | null> {
  try {
    const mockStatus: GitStatus = {
      branch: 'main',
      ahead: 1,
      behind: 0,
      modified: [
        'src/App.tsx',
        'src/components/DevPanel.tsx',
        'src/index.css'
      ],
      untracked: [
        'src/utils/gitHistory.ts'
      ],
      staged: []
    };

    await new Promise(resolve => setTimeout(resolve, 200));

    return mockStatus;
  } catch (error) {
    console.error('Error fetching git status:', error);
    return null;
  }
}

/**
 * שליפת ענפים
 */
export async function fetchGitBranches(): Promise<GitBranch[]> {
  try {
    const mockBranches: GitBranch[] = [
      {
        name: 'main',
        current: true,
        lastCommit: '961bd1e'
      },
      {
        name: 'develop',
        current: false,
        lastCommit: '6f161c4'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 200));

    return mockBranches;
  } catch (error) {
    console.error('Error fetching git branches:', error);
    return [];
  }
}

/**
 * שליפת מידע על commit ספציפי
 */
export async function fetchCommitDetails(hash: string): Promise<GitCommit | null> {
  try {
    const history = await fetchGitHistory();
    return history.find(commit => commit.hash === hash) || null;
  } catch (error) {
    console.error('Error fetching commit details:', error);
    return null;
  }
}

/**
 * פורמט של commit message לעברית
 */
export function formatCommitMessage(message: string): string {
  // הסרת אימוג'י אם צריך
  const cleanMessage = message.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
  return cleanMessage || message;
}

/**
 * חישוב זמן יחסי (לפני כמה זמן)
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'לפני כמה שניות';
  } else if (diffMinutes < 60) {
    return `לפני ${diffMinutes} דקות`;
  } else if (diffHours < 24) {
    return `לפני ${diffHours} שעות`;
  } else if (diffDays < 30) {
    return `לפני ${diffDays} ימים`;
  } else {
    return date.toLocaleDateString('he-IL');
  }
}

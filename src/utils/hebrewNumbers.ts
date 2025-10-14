// Convert numbers to Hebrew letters (א', ב', ג', etc.)
const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const hundreds = ["", "ק", "ר", "ש", "ת"];

export const toHebrewNumber = (num: number): string => {
  if (num === 0) return "";
  if (num > 999) return num.toString(); // Fallback for very large numbers

  let result = "";
  const h = Math.floor(num / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;

  // Special cases for 15 and 16 (to avoid using God's name)
  if (num === 15) return "טו";
  if (num === 16) return "טז";

  // Hundreds
  if (h > 0) {
    // For 500-900, use ת multiple times
    if (h >= 5) {
      result += hundreds[4].repeat(Math.floor(h / 4));
      result += hundreds[h % 4];
    } else {
      result += hundreds[h];
    }
  }

  // Tens and ones (handle special cases)
  if (t === 1 && o === 5) {
    result += "טו";
  } else if (t === 1 && o === 6) {
    result += "טז";
  } else {
    result += tens[t] + ones[o];
  }

  return result;
};

// Convert Hebrew number back to regular number (for sorting/filtering)
export const fromHebrewNumber = (hebrew: string): number => {
  // This is a reverse function if needed, for now return 0
  // Can be implemented if needed for parsing
  return 0;
};

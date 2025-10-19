// Utility to fix data issues in JSON content
export const fixJsonContent = (content: string): string => {
  // Replace "אבן עזרה" with "אבן עזרא"
  let fixed = content.replace(/אבן עזרה/g, 'אבן עזרא');
  
  // Replace "יקוק" with "יהוה" (only when it's a standalone word, not part of another word like "חיקוק" or "זיקוק")
  // Match יקוק when it's preceded by space, quote, or start of string
  // and followed by space, punctuation, quote, or end of string
  fixed = fixed.replace(/(\s|"|'|^)(יקוק)(\s|'|"|,|\.|\?|!|:|;|$)/g, '$1יהוה$3');
  
  return fixed;
};

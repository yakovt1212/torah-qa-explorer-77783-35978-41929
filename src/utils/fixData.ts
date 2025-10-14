// Utility to fix data issues in JSON content
export const fixJsonContent = (content: string): string => {
  // Replace "אבן עזרה" with "אבן עזרא"
  let fixed = content.replace(/אבן עזרה/g, 'אבן עזרא');
  
  // Replace "יקוק" with "יהוה"  
  fixed = fixed.replace(/יקוק/g, 'יהוה');
  
  return fixed;
};

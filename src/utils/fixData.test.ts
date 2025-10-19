// Test file to verify יקוק → יהוה conversion
import { fixJsonContent } from './fixData';

// Test cases
const testCases = [
  {
    input: ' יקוק אמר',
    expected: ' יהוה אמר',
    description: 'יקוק עם רווח לפני ואחרי'
  },
  {
    input: '"יקוק"',
    expected: '"יהוה"',
    description: 'יקוק במירכאות'
  },
  {
    input: 'יקוק.',
    expected: 'יהוה.',
    description: 'יקוק עם נקודה'
  },
  {
    input: 'מרוב זיקוק ומהתמדת',
    expected: 'מרוב זיקוק ומהתמדת',
    description: 'זיקוק - לא צריך להשתנות'
  },
  {
    input: 'לשון חיקוק אנטליי',
    expected: 'לשון חיקוק אנטליי',
    description: 'חיקוק - לא צריך להשתנות'
  },
  {
    input: "יקוק'",
    expected: "יהוה'",
    description: 'יקוק עם גרש'
  }
];

console.log('🧪 בדיקת המרת יקוק ← יהוה\n');

testCases.forEach((test, index) => {
  const result = fixJsonContent(test.input);
  const passed = result === test.expected;
  const icon = passed ? '✅' : '❌';
  
  console.log(`${icon} מבחן ${index + 1}: ${test.description}`);
  console.log(`   קלט:    "${test.input}"`);
  console.log(`   פלט:    "${result}"`);
  console.log(`   צפוי:   "${test.expected}"`);
  console.log(`   תוצאה: ${passed ? 'עבר' : 'נכשל'}\n`);
});

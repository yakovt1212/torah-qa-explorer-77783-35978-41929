#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('📤 מסנכרן עם GitHub...\n');

try {
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  
  console.log(`🌿 ענף נוכחי: ${branch}\n`);
  
  // Fetch latest
  console.log('📥 מוריד עדכונים...');
  execSync('git fetch origin', { stdio: 'inherit' });
  
  // Check if there are differences
  const status = execSync('git status -sb', { encoding: 'utf-8' });
  console.log('\n' + status);
  
  // Pull if needed
  console.log('\n⬇️  מסנכרן שינויים מהשרת...');
  execSync(`git pull origin ${branch}`, { stdio: 'inherit' });
  
  // Push if there are local commits
  console.log('\n⬆️  דוחף שינויים לשרת...');
  execSync(`git push origin ${branch}`, { stdio: 'inherit' });
  
  console.log('\n✅ סינכרון הושלם בהצלחה!');
  
} catch (error) {
  console.error('\n❌ שגיאה בסינכרון:', error.message);
  console.log('\n💡 ייתכן שאין שינויים לסנכרן או שיש קונפליקט');
  process.exit(1);
}

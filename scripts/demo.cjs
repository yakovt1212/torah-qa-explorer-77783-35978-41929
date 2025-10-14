#!/usr/bin/env node

/**
 * Demo script - הדגמת יכולות המערכת
 * מריץ את כל הפונקציות ומציג דוגמאות
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('🎯 הדגמת מערכת הסינכרון והגרסאות');
console.log('═══════════════════════════════════════════════════════════\n');

// Helper function to run command and display output
function runDemo(title, command, description) {
  console.log(`\n📌 ${title}`);
  console.log(`   ${description}`);
  console.log('   ─────────────────────────────────────────────────────');
  
  try {
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });
    console.log(output);
  } catch (error) {
    console.log(`   ⚠️ ${error.message}`);
  }
  
  console.log('   ─────────────────────────────────────────────────────\n');
}

// Demo 1: Git Status
runDemo(
  'סטטוס Git נוכחי',
  'git status',
  'בדיקת מצב הקבצים במאגר'
);

// Demo 2: Current Branch
runDemo(
  'ענף נוכחי',
  'git branch --show-current',
  'הצגת הענף הפעיל'
);

// Demo 3: Recent Commits
runDemo(
  '5 Commits אחרונים',
  'git log --oneline --graph --decorate -5',
  'היסטוריית השינויים האחרונה'
);

// Demo 4: Changed Files Count
console.log('📊 סטטיסטיקות');
console.log('   ─────────────────────────────────────────────────────');
try {
  const totalCommits = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
  const branches = execSync('git branch -a', { encoding: 'utf-8' }).split('\n').length - 1;
  const changedFiles = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  const changedCount = changedFiles ? changedFiles.split('\n').length : 0;
  
  console.log(`   📝 סה"כ commits: ${totalCommits}`);
  console.log(`   🌿 מספר ענפים: ${branches}`);
  console.log(`   ⚠️ קבצים ששונו: ${changedCount}`);
} catch (error) {
  console.log(`   ⚠️ לא ניתן להציג סטטיסטיקות`);
}
console.log('   ─────────────────────────────────────────────────────\n');

// Demo 5: Version Files
console.log('📦 קבצי גרסאות');
console.log('   ─────────────────────────────────────────────────────');
const versionsDir = path.join(process.cwd(), '.versions');
if (fs.existsSync(versionsDir)) {
  const versionFiles = fs.readdirSync(versionsDir)
    .filter(f => f.startsWith('version-') && f.endsWith('.json'));
  
  console.log(`   📂 נמצאו ${versionFiles.length} קבצי גרסאות`);
  
  if (versionFiles.length > 0) {
    console.log('\n   🔖 גרסאות אחרונות:');
    versionFiles.slice(-5).reverse().forEach(file => {
      const version = JSON.parse(fs.readFileSync(path.join(versionsDir, file), 'utf-8'));
      const date = new Date(version.timestamp).toLocaleString('he-IL');
      console.log(`      • ${version.version} | ${date} | ${version.filesChanged} קבצים`);
    });
  }
} else {
  console.log('   📂 טרם נוצרו קבצי גרסאות');
  console.log('   💡 הרץ `npm run auto-commit` ליצירת הגרסה הראשונה');
}
console.log('   ─────────────────────────────────────────────────────\n');

// Demo 6: Available Scripts
console.log('⚙️ פקודות זמינות');
console.log('   ─────────────────────────────────────────────────────');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const scripts = packageJson.scripts || {};

Object.entries(scripts)
  .filter(([key]) => key.includes('auto') || key.includes('version') || key.includes('sync'))
  .forEach(([key, value]) => {
    console.log(`   📌 npm run ${key.padEnd(20)} → ${value}`);
  });
console.log('   ─────────────────────────────────────────────────────\n');

// Demo 7: Git Configuration
console.log('🔧 הגדרות Git');
console.log('   ─────────────────────────────────────────────────────');
try {
  const userName = execSync('git config user.name', { encoding: 'utf-8' }).trim();
  const userEmail = execSync('git config user.email', { encoding: 'utf-8' }).trim();
  const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  
  console.log(`   👤 שם: ${userName}`);
  console.log(`   📧 אימייל: ${userEmail}`);
  console.log(`   🌐 Remote: ${remote}`);
} catch (error) {
  console.log(`   ⚠️ לא ניתן להציג הגדרות Git`);
}
console.log('   ─────────────────────────────────────────────────────\n');

// Demo 8: Files Structure
console.log('📁 מבנה הקבצים');
console.log('   ─────────────────────────────────────────────────────');
const checkPath = (dir, description) => {
  const exists = fs.existsSync(dir);
  const icon = exists ? '✅' : '❌';
  console.log(`   ${icon} ${description.padEnd(30)} ${exists ? '(קיים)' : '(חסר)'}`);
};

checkPath('.github/workflows/auto-sync.yml', 'GitHub Actions');
checkPath('.husky', 'Git Hooks (Husky)');
checkPath('scripts/auto-commit.js', 'Auto-commit script');
checkPath('scripts/version-info.js', 'Version info script');
checkPath('scripts/sync-github.js', 'Sync script');
checkPath('GIT_SYNC_GUIDE.md', 'מדריך שימוש');
checkPath('QUICK_START.md', 'התחלה מהירה');
console.log('   ─────────────────────────────────────────────────────\n');

// Final message
console.log('═══════════════════════════════════════════════════════════');
console.log('✅ ההדגמה הושלמה!');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('💡 מה עכשיו?');
console.log('   1️⃣  הגדר GitHub credentials (ראה GITHUB_AUTH_FIX.md)');
console.log('   2️⃣  הרץ: npm install');
console.log('   3️⃣  הרץ: npm run prepare');
console.log('   4️⃣  נסה: npm run auto-commit');
console.log('');
console.log('📖 למידע נוסף: cat QUICK_START.md');
console.log('');

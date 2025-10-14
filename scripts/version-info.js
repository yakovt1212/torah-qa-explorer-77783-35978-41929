#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 מידע על הגרסה הנוכחית\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

try {
  // Current commit
  const commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
  const shortCommit = commit.slice(0, 7);
  
  // Current branch
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  
  // Last commit message
  const lastMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();
  
  // Last commit date
  const lastDate = execSync('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"', { encoding: 'utf-8' }).trim();
  
  // Number of commits
  const totalCommits = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
  
  // Changed files (uncommitted)
  const changedFiles = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  const changedCount = changedFiles ? changedFiles.split('\n').length : 0;

  console.log(`🏷️  Commit:        ${shortCommit} (${commit})`);
  console.log(`🌿 ענף:           ${branch}`);
  console.log(`📅 תאריך:         ${lastDate}`);
  console.log(`📝 סה"כ commits:  ${totalCommits}`);
  console.log(`⚠️  שינויים ממתינים: ${changedCount}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 הודעת Commit אחרונה:\n');
  console.log(lastMessage);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Show latest version file if exists
  const versionsDir = path.join(process.cwd(), '.versions');
  if (fs.existsSync(versionsDir)) {
    const versionFiles = fs.readdirSync(versionsDir)
      .filter(f => f.startsWith('version-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (versionFiles.length > 0) {
      const latestVersion = JSON.parse(
        fs.readFileSync(path.join(versionsDir, versionFiles[0]), 'utf-8')
      );
      console.log('🔖 גרסה אחרונה שנשמרה:\n');
      console.log(`   גרסה:     ${latestVersion.version}`);
      console.log(`   תאריך:    ${new Date(latestVersion.timestamp).toLocaleString('he-IL')}`);
      console.log(`   קבצים:    ${latestVersion.filesChanged}`);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
  }

  if (changedCount > 0) {
    console.log('⚠️  קבצים ששונו (טרם נשמרו):\n');
    console.log(changedFiles);
    console.log('\n💡 הרץ `npm run auto-commit` לשמירה וסינכרון\n');
  }

} catch (error) {
  console.error('❌ שגיאה:', error.message);
  process.exit(1);
}

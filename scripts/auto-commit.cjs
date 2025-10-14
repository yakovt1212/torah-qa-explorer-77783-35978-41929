#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate version number
const version = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });

console.log('🔄 מתחיל commit אוטומטי...\n');

try {
  // Check for changes
  const status = execSync('git status --porcelain', { encoding: 'utf-8' });
  
  if (!status.trim()) {
    console.log('✅ אין שינויים לשמירה');
    process.exit(0);
  }

  // Get changed files
  const changedFiles = status.split('\n').filter(line => line.trim());
  console.log(`📝 נמצאו ${changedFiles.length} קבצים ששונו:\n`);
  changedFiles.forEach(file => console.log(`   ${file}`));

  // Add all changes
  console.log('\n📦 מוסיף קבצים...');
  execSync('git add .', { stdio: 'inherit' });

  // Create detailed commit message
  const commitMessage = `🔄 עדכון אוטומטי - גרסה ${version}

📋 פרטי העדכון:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ תאריך: ${timestamp}
📊 קבצים ששונו: ${changedFiles.length}
🏷️  גרסה: ${version}

📝 שינויים:
${changedFiles.map(f => `   • ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ שינויים אלו נשמרו ונסנכרנו אוטומטית
`;

  // Commit
  console.log('\n💾 שומר שינויים...');
  execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });

  // Push to GitHub
  console.log('\n📤 מסנכרן עם GitHub...');
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  execSync(`git push origin ${branch}`, { stdio: 'inherit' });

  // Save version info
  const versionsDir = path.join(process.cwd(), '.versions');
  if (!fs.existsSync(versionsDir)) {
    fs.mkdirSync(versionsDir, { recursive: true });
  }

  const versionInfo = {
    version,
    timestamp: new Date().toISOString(),
    branch,
    filesChanged: changedFiles.length,
    files: changedFiles,
    commit: execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
  };

  fs.writeFileSync(
    path.join(versionsDir, `version-${version}.json`),
    JSON.stringify(versionInfo, null, 2)
  );

  console.log('\n✅ הושלם בהצלחה!');
  console.log(`📌 גרסה: ${version}`);
  console.log(`🌐 סונכרן עם GitHub: ${branch}`);
  
} catch (error) {
  console.error('\n❌ שגיאה:', error.message);
  process.exit(1);
}

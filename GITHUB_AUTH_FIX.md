# 🔧 פתרון בעיית הרשאות GitHub

## הבעיה
הופיעה שגיאת 403 כאשר ניסינו להעלות קוד ל-GitHub.

## הפתרון - 3 אפשרויות

### אפשרות 1: שימוש ב-GitHub CLI (מומלץ)

1. **התקן את GitHub CLI:**
   - הורד מ-https://cli.github.com/
   - או דרך PowerShell:
   \`\`\`powershell
   winget install --id GitHub.cli
   \`\`\`

2. **התחבר:**
   \`\`\`powershell
   gh auth login
   \`\`\`
   
3. **בחר:**
   - GitHub.com
   - HTTPS
   - Login with a web browser
   - העתק את הקוד והתחבר

4. **דחוף שוב:**
   \`\`\`powershell
   git push origin main
   \`\`\`

### אפשרות 2: Personal Access Token

1. **צור Token:**
   - לך ל-https://github.com/settings/tokens
   - לחץ "Generate new token (classic)"
   - בחר scopes:
     - ✅ repo (הכל)
     - ✅ workflow
   - לחץ "Generate token"
   - **העתק את ה-Token** (לא תראה אותו שוב!)

2. **שמור את ה-Token:**
   \`\`\`powershell
   git config --global credential.helper wincred
   \`\`\`

3. **דחוף עם ה-Token:**
   \`\`\`powershell
   git push origin main
   \`\`\`
   
   כאשר יתבקש password, הדבק את ה-Token (לא את הסיסמה!)

### אפשרות 3: SSH Key (מתקדם)

1. **צור SSH Key:**
   \`\`\`powershell
   ssh-keygen -t ed25519 -C "your-email@example.com"
   \`\`\`

2. **הוסף ל-ssh-agent:**
   \`\`\`powershell
   Get-Service ssh-agent | Set-Service -StartupType Automatic
   Start-Service ssh-agent
   ssh-add ~\.ssh\id_ed25519
   \`\`\`

3. **העתק את המפתח הציבורי:**
   \`\`\`powershell
   Get-Content ~\.ssh\id_ed25519.pub | clip
   \`\`\`

4. **הוסף ל-GitHub:**
   - לך ל-https://github.com/settings/keys
   - לחץ "New SSH key"
   - הדבק את המפתח
   - שמור

5. **שנה את ה-remote ל-SSH:**
   \`\`\`powershell
   git remote set-url origin git@github.com:yakovt1212/torah-qa-explorer-77783-35978-41929.git
   \`\`\`

6. **דחוף:**
   \`\`\`powershell
   git push origin main
   \`\`\`

## בדיקה

לאחר ההגדרה, בדוק:
\`\`\`powershell
# בדוק את ה-remote
git remote -v

# נסה לדחוף
git push origin main

# או השתמש בפקודה המובנית
npm run sync
\`\`\`

## שאלות נפוצות

### ❓ איך אני יודע איזה אפשרות לבחור?
- **מתחיל?** → אפשרות 1 (GitHub CLI)
- **מנוסה?** → אפשרות 2 (Token)
- **מתקדם?** → אפשרות 3 (SSH)

### ❓ מה אם זה עדיין לא עובד?
\`\`\`powershell
# בדוק את ה-credentials
git config --list | Select-String credential

# נקה credentials ישנים
git credential-manager-core delete https://github.com
\`\`\`

### ❓ איך אני מוודא שזה עבד?
\`\`\`powershell
git push origin main
# אם זה עובד ללא שגיאות - מזל טוב! 🎉
\`\`\`

## לאחר הפתרון

כשהכל עובד, נסה:
\`\`\`powershell
npm run auto-commit
\`\`\`

זה יעשה commit אוטומטי ויעלה ל-GitHub בפקודה אחת!

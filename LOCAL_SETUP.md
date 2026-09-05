# 🖥️ Local Development Setup

## 📁 Step 1: Create Your Work Folder Structure

```bash
# في Terminal / Command Prompt خاصك
# اختر المسار اللي أنت فيه (مثلاً Desktop أو Documents)

# macOS/Linux
mkdir -p ~/work/cv-form-generator
cd ~/work/cv-form-generator

# Windows (PowerShell)
mkdir C:\work\cv-form-generator
cd C:\work\cv-form-generator
```

## 📥 Step 2: Download Files to Your Folder

**Option A: Copy from the outputs folder** (Easiest)
```bash
# أنسخ هذه الملفات من /mnt/user-data/outputs إلى مجلد work خاصك:
- index.html
- styles.css
- app.js
- README.md
- TODO.md
- QUICK_START.md
```

**Option B: Create Files Manually**
في Claude Code، ستنشئهم step-by-step.

## 🎯 Step 3: Folder Structure (Local)

بعد ما تنسخ الملفات، المجلد تبعك يكون كذا:

```
~/work/cv-form-generator/
├── index.html
├── styles.css
├── app.js
├── README.md
├── TODO.md
├── QUICK_START.md
├── .gitignore (optional - see below)
└── docs/ (optional)
    ├── DEVELOPMENT.md
    └── PROJECT_NOTES.md
```

## 🚀 Step 4: Open in Claude Code Desktop

### الطريقة الأولى: من Claude Code نفسه
```
1. افتح Claude Code Desktop
2. Click: File → Open Folder
3. اختار المجلد: ~/work/cv-form-generator
4. Wait for indexing to finish
5. شوف الملفات في sidebar اليسار
```

### الطريقة الثانية: من Terminal
```bash
# في مجلد المشروع
code .
```

## 📝 Step 5: Setup Git (Optional but Recommended)

```bash
cd ~/work/cv-form-generator

# Initialize Git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
.DS_Store
Thumbs.db
.env
.env.local
node_modules/
dist/
build/
*.log
EOF

# First commit
git add .
git commit -m "Initial commit: CV Form Generator MVP"
```

## 🔧 Step 6: Project Structure in Claude Code

بعد فتح المجلد، أنت تشتغل في بيئة كاملة:

```
Left Sidebar (Explorer):
├── cv-form-generator/
│   ├── index.html        ← Click to edit
│   ├── styles.css        ← Click to edit
│   ├── app.js            ← Click to edit
│   ├── README.md
│   ├── TODO.md
│   └── QUICK_START.md
```

## ✅ Step 7: Test Your Local Setup

### تشغيل الملف locally:

**Windows:**
```bash
# في CMD من مجلد المشروع
start index.html
```

**macOS:**
```bash
open index.html
```

**Linux:**
```bash
firefox index.html
# أو
google-chrome index.html
```

### أو استخدم Live Server (أحسن):

في Claude Code:
```
1. Extensions: Ctrl+Shift+X
2. Search: "Live Server"
3. Install
4. Right-click on index.html
5. "Open with Live Server"
```

هيفتح في المتصفح و يتحدث تلقائياً كل ما تعدل ملف!

## 💡 Step 8: Development Workflow

### أثناء الشغل:

```
1. Open Claude Code (~/work/cv-form-generator)
2. Open index.html with Live Server
3. في tab ثاني: أفتح DevTools (F12)
4. اختار Console
5. ابدأ في التعديل
6. كل ما تحفظ الملف، المتصفح يتحدث تلقائياً
7. Check console للأخطاء
```

### Quick Commands في Claude Code:

| Action | Shortcut |
|--------|----------|
| Search file | Ctrl+P |
| Find in files | Ctrl+Shift+F |
| Replace | Ctrl+H |
| Terminal | Ctrl+` |
| Save | Ctrl+S |
| Format | Shift+Alt+F |

## 🎨 Step 9: Making Your First Change

### Change 1: Add Dark Mode (Easy - 10 mins)

**File: app.js**
```javascript
// Add this at the end of the file, after the last function

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', 
        document.body.classList.contains('dark-mode')
    );
}

// Load dark mode preference on page load
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    loadData(); // existing code
});
```

**File: styles.css**
```css
/* Add at the end of the file */

/* Dark Mode */
body.dark-mode {
    background: #1e1e1e;
    color: #f0f0f0;
}

body.dark-mode .container {
    background: #2d2d2d;
    color: #f0f0f0;
}

body.dark-mode input,
body.dark-mode textarea,
body.dark-mode select {
    background: #3d3d3d;
    color: #f0f0f0;
    border-color: #555;
}

body.dark-mode input:focus,
body.dark-mode textarea:focus,
body.dark-mode select:focus {
    border-color: #667eea;
}

body.dark-mode .section-title {
    color: #88a0ff;
}

body.dark-mode .tab-button.active {
    color: #88a0ff;
}
```

**File: index.html**
```html
<!-- في header section، بعد button group أضف: -->
<button onclick="toggleDarkMode()" class="btn-theme">🌙 Dark Mode</button>
```

**في styles.css أضف:**
```css
.btn-theme {
    background: #ffd700;
    color: #333;
    padding: 10px 20px;
}

.btn-theme:hover {
    background: #ffed4e;
}
```

### Save → Test → Done! ✅

## 📊 Step 10: Monitor Your Progress

### في Claude Code Terminal:

```bash
# Watch the file size
ls -lh *.js *.css *.html

# Count lines
wc -l *.js *.css *.html

# Git status (إذا استخدمت git)
git status
git log --oneline
```

## 🔄 Step 11: Commit Your Changes

```bash
# بعد ما تخلص feature معينة

git add .
git commit -m "feat: add dark mode toggle"

# شوف commits
git log --oneline --graph
```

## 🐛 Debugging Tips

### في Claude Code:

**1. Integrated Terminal**
```
Ctrl+` → opens terminal at project root
```

**2. Debug JavaScript**
```
1. F12 في المتصفح
2. Sources tab
3. Open index.html file
4. Set breakpoints
5. Run code and debug
```

**3. Check for errors**
```
Console tab → F12 → Look for red errors
```

### Common Issues:

```
❌ "Can't find JSZip"
✅ Solution: Check script tags in index.html
   <script src="https://cdnjs.cloudflare.com/..."></script>

❌ Arabic text issues
✅ Solution: Check encoding: UTF-8 in index.html

❌ Form not saving
✅ Solution: Check browser localStorage
   F12 → Application → Storage → Local Storage
```

## 📚 Step 12: Project Documentation in Code

في Claude Code، أنشئ مجلد `docs/`:

```bash
mkdir docs
```

ثم create:

**docs/DEVELOPMENT.md**
```markdown
# Development Notes

## Current Sprint
- [ ] Task 1
- [ ] Task 2

## Ideas
- Feature X
- Enhancement Y

## Bugs
- Bug 1 - Status: Open
```

**docs/PROJECT_NOTES.md**
```markdown
# Project Notes

## Architecture
- Frontend: HTML5 + CSS3 + Vanilla JS
- Storage: localStorage (browser)
- Export: Word documents (DOCX)

## Key Files
- index.html: UI & form structure
- app.js: All logic
- styles.css: All styling

## Tech Stack
- JSZip: Create DOCX files
- FileSaver: Download files
- CSS Grid: Responsive layout
```

## 🎯 Step 13: Common Tasks

### إضافة حقل جديد:

```html
<!-- في index.html في tab-content المناسب -->
<div class="form-group full">
    <label for="newField">عنوان الحقل</label>
    <input type="text" id="newField" name="newField">
</div>
```

**That's it!** 
- يحفظ تلقائياً (من app.js)
- يحمل تلقائياً (من app.js)
- يضاف للـ Word تلقائياً (من generateDocument())

### تعديل تنسيق Word:

```javascript
// في app.js، في دالة createWordXml()
// عدل XML structure

// مثلاً: اضف bold
<w:r><w:rPr><w:b/></w:rPr><w:t>نص bold</w:t></w:r>

// أو italic
<w:r><w:rPr><w:i/></w:rPr><w:t>نص italic</w:t></w:r>

// أو حجم الخط
<w:r><w:rPr><w:sz w:val="48"/></w:rPr><w:t>نص أكبر</w:t></w:r>
```

## ✨ Step 14: Use Claude Code Features

### 1. **Zen Mode** (Full focus)
```
View → Zen Mode
أو Ctrl+K, Z
```

### 2. **Split View** (Two files side-by-side)
```
Right-click on file → Open to the Side
أو Ctrl+\ (backslash)
```

### 3. **Outline** (Jump to functions)
```
Ctrl+Shift+O
شوف كل functions في الملف الحالي
```

### 4. **Go to Line**
```
Ctrl+G
انقفز لـ line معين
```

### 5. **Command Palette**
```
Ctrl+Shift+P
ابحث عن أي command
```

## 🔗 Step 15: Syncing Between Machines

**إذا تشتغل من أجهزة مختلفة:**

```bash
# On Machine A
git push origin main

# On Machine B
git pull origin main

# أو استخدم GitHub Desktop - أسهل
```

## 📱 Step 16: Test on Mobile

```bash
# في localhost
# أوجد IP address
ipconfig getifaddr en0  # macOS
ipconfig               # Windows

# In mobile browser, visit:
http://YOUR_IP:5500
# (5500 is Live Server default port)
```

## 🎉 Step 17: You're Ready!

Checklist:
- ✅ Folder created locally
- ✅ Files copied
- ✅ Opened in Claude Code
- ✅ Live Server running
- ✅ Testing in browser
- ✅ Git initialized
- ✅ Ready to code!

## 💻 Quick Reference

```bash
# Navigate to project
cd ~/work/cv-form-generator

# Open in Claude Code
code .

# Start git tracking
git init
git add .
git commit -m "init"

# Create new branch for feature
git checkout -b feature/dark-mode

# Check git status
git status

# See what you changed
git diff

# Commit changes
git add .
git commit -m "feat: dark mode"

# Switch back to main
git checkout main

# Merge feature
git merge feature/dark-mode
```

---

## 🆘 Need Help?

في Claude Code نفسه، استخدم:

```
1. Click your question → Select code
2. Ctrl+Shift+A → Ask Claude about it
3. Claude بيساعدك في debugging
```

أو في chat (هنا):
```
صور الخطأ في الـ console
رسالة الخطأ بالكامل
وين تحديداً الخطأ
وأنا بساعدك!
```

---

**Last Updated:** September 2026  
**Status:** Ready for Local Development  
**Next:** Pick a feature from TODO.md and start coding! 🚀
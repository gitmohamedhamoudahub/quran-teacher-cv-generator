# ⚡ Quick Commands Reference

## 🚀 Get Started NOW (Copy-Paste)

### Windows PowerShell
```powershell
# 1. Create folder
mkdir C:\work\cv-form-generator
cd C:\work\cv-form-generator

# 2. Create basic files (we'll copy content from outputs)
# Do this in Claude Code instead

# 3. Open in Claude Code
code .
```

### macOS/Linux
```bash
# 1. Create folder
mkdir -p ~/work/cv-form-generator
cd ~/work/cv-form-generator

# 2. Open in Claude Code
code .
```

---

## 📋 Checklist: First Time Setup

```
□ Create ~/work/cv-form-generator folder
□ Copy index.html, styles.css, app.js from /outputs
□ Open folder in Claude Code
□ Install Live Server extension
□ Right-click index.html → Open with Live Server
□ Test in browser (form should work)
□ Optional: git init
□ Start coding!
```

---

## 🎯 File Locations

```
Your Local Folder Structure:
~/work/cv-form-generator/
├── index.html          (Main form)
├── styles.css          (Styling)
├── app.js              (Logic)
├── README.md           (Full docs)
├── QUICK_START.md      (Start here)
├── TODO.md             (What to build)
├── LOCAL_SETUP.md      (This file)
└── docs/               (Optional folder)
```

---

## ⌨️ Claude Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Open file | Ctrl+P |
| Find text | Ctrl+F |
| Replace | Ctrl+H |
| Save | Ctrl+S |
| Terminal | Ctrl+` |
| Format code | Shift+Alt+F |
| Go to line | Ctrl+G |
| Outline/Functions | Ctrl+Shift+O |
| Split editor | Ctrl+\ |
| Command palette | Ctrl+Shift+P |

---

## 🔧 Common Tasks

### Add a new form field
```javascript
// 1. In index.html, add:
<input type="text" id="myField" name="myField">

// 2. Done! Auto-saves, loads, and exports to Word
```

### Change colors
```css
/* In styles.css */

/* Header color */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Button colors */
.btn-save { background: #4CAF50; }
.btn-download { background: #2196F3; }
.btn-reset { background: #f44336; }
```

### Test locally
```bash
# Just open index.html in browser, or:

# Option 1: Live Server (recommended)
# Right-click index.html → Open with Live Server

# Option 2: Python
python -m http.server 8000
# Then: http://localhost:8000

# Option 3: Node (if you have it)
npx http-server
```

### Check what changed
```bash
git status        # See changes
git diff         # See details
git add .        # Stage all
git commit -m "message"  # Commit
```

---

## 📱 Browser DevTools (F12)

```
Ctrl+Shift+I (or F12) opens DevTools

Key tabs:
┌─────────────────────────────────────┐
│ Inspector │ Console │ Network │ ... │
└─────────────────────────────────────┘

Console: Type localStorage to see saved data
Network: Watch file downloads
Elements: Inspect HTML/CSS
```

---

## 🐛 Debug JavaScript

In browser console (F12 → Console):

```javascript
// Check saved data
localStorage

// Check specific field
localStorage.getItem('cvData')

// Parse it nicely
JSON.parse(localStorage.getItem('cvData'))

// Clear all data
localStorage.clear()

// Check form data
document.getElementById('fullName').value
```

---

## 📝 Make Your First Edit

### Option 1: Change header color (2 mins)

File: `styles.css`

Find this:
```css
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Change to:
```css
.header {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}
```

Save → Browser updates automatically! 🎉

### Option 2: Add auto-save (5 mins)

File: `app.js`

Add at the end:
```javascript
// Auto-save every 30 seconds
setInterval(() => {
    const hasData = Object.values(document.forms[0]).some(
        field => field.value
    );
    if (hasData) {
        saveData();
        console.log('✅ Auto-saved at', new Date().toLocaleTimeString());
    }
}, 30000);
```

Save → Watch console see auto-save messages! 🎉

### Option 3: Add thank you message (10 mins)

File: `app.js`

Find `showStatus()` function, add after:
```javascript
// Show inspirational message after save
function showSuccessMessage() {
    const messages = [
        'تمام التمام! 👏',
        'ممتاز! السيرة محفوظة 🎉',
        'تماشي يا محترف! 🚀',
        'بارك الله فيك! 🌟'
    ];
    const random = messages[Math.floor(Math.random() * messages.length)];
    showStatus(random, 'success');
}
```

Then in `saveData()`, change:
```javascript
showStatus('تم حفظ البيانات بنجاح! ✅', 'success');
```

To:
```javascript
showSuccessMessage();
```

---

## 🔗 Useful Resources (If You Get Stuck)

### JavaScript Help
- MDN Web Docs: https://developer.mozilla.org/
- Search: "how to [what you want] javascript"

### CSS Help
- CSS-Tricks: https://css-tricks.com
- Color picker: https://coolors.co

### Word Document (DOCX)
- Office Open XML: https://en.wikipedia.org/wiki/Office_Open_XML
- Our approach: JSZip creates the ZIP structure

---

## 🎯 Next Feature Ideas (Pick One!)

### Easy (30 mins - 1 hour)
- [ ] Change colors/styling
- [ ] Add auto-save
- [ ] Add dark mode
- [ ] Change fonts
- [ ] Add animation on buttons

### Medium (1-3 hours)
- [ ] Improve Word formatting (tables)
- [ ] Add image support
- [ ] Add form validation
- [ ] Add success animations
- [ ] Multiple CV storage

### Hard (3+ hours)
- [ ] Live preview pane
- [ ] PDF export
- [ ] Database (Firebase/IndexedDB)
- [ ] Share functionality
- [ ] API backend

---

## 💡 Pro Tips

1. **Always save before testing**
   - Ctrl+S to save
   - Refresh browser
   - Test

2. **Use browser DevTools**
   - F12 → Console most important
   - Watch for red error messages
   - Copy error message to Claude if stuck

3. **Test incrementally**
   - Change one thing
   - Test it
   - If it breaks, undo (Ctrl+Z)
   - Try again

4. **Keep terminal open**
   - Ctrl+` in Claude Code
   - See any errors
   - Run commands

5. **Comment your changes**
   - Add `// TODO:` for future work
   - Add `// FIXED:` for what you fixed
   - Add `// NOTE:` for important info

---

## 🆘 If Something Breaks

```
1. Don't panic! 😅
2. Ctrl+Z to undo last change
3. Refresh browser (Ctrl+R)
4. Check browser console (F12)
5. Look for red error message
6. Copy the error message
7. Tell me in chat with:
   - The error message
   - What you were trying to do
   - Which file you edited
8. I'll fix it! 💪
```

---

## 📊 Git Quick Reference

```bash
# First time
git init
git add .
git commit -m "Initial commit"

# Regular commits
git add .
git commit -m "feat: add dark mode"

# See history
git log --oneline

# See changes
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (delete changes)
git reset --hard HEAD~1
```

---

## 🚀 Workflow Loop (Repeat This)

```
1. Open Claude Code
   └─ Your project already open

2. Make ONE small change
   └─ Edit one file
   └─ Save (Ctrl+S)

3. Test
   └─ Look at browser
   └─ Check if it works
   └─ Check console (F12)

4. Commit (if happy)
   └─ git add .
   └─ git commit -m "what you did"

5. Pick next task
   └─ Go to TODO.md
   └─ Pick next feature
   └─ Repeat from step 2
```

---

## 💬 Chat with Me

When you get stuck:
```
Show me:
1. The error message (from console)
2. The code you changed
3. What you expected to happen
4. What actually happened

Then I can fix it! 🎯
```

---

## ✅ You're Ready!

Right now, you have:
- ✅ Working form
- ✅ Data saves locally
- ✅ Exports to Word
- ✅ Arabic support
- ✅ Mobile responsive
- ✅ All code organized

**Next 15 minutes:**
1. Copy files to ~/work/cv-form-generator
2. Open in Claude Code
3. Run Live Server
4. Test in browser
5. Make one small change
6. Commit
7. Pick next feature

**Go! 🚀**

---

**Version:** 1.0  
**Last Updated:** September 2026  
**Status:** Ready to Code
# Language Switcher Troubleshooting Guide

## ✅ Fixes Applied

I've fixed the following issues:

### 1. **CSS Import Error** ✅
- Moved `@import` statement to top of `globals.css`
- Font imports now load properly

### 2. **i18n Initialization** ✅
- Fixed localStorage access in i18n config
- Added proper window check for SSR compatibility
- Added Suspense wrapper for i18n loading

### 3. **Debug Logging** ✅
- Added console.log statements to track language changes
- You'll see logs when clicking the language switcher

---

## 🧪 How to Test

### Step 1: Open Browser Console
1. Open your app in browser
2. Press **F12** or **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
3. Go to **Console** tab

### Step 2: Look for Globe Icon 🌐
Check these locations:
- **Landing page**: Top right navigation (before "Login")
- **App mobile**: Top header next to menu
- **App desktop**: Left sidebar bottom
- **Mobile menu**: Inside slide-out menu

### Step 3: Click the Globe Icon
When you click it, you should see in console:
```
Current language: it {code: 'it', name: 'Italian', ...}
```

### Step 4: Select a Language
Click on a language (e.g., "English"), you should see:
```
Changing language to: en
Current language: en {code: 'en', name: 'English', ...}
```

### Step 5: Verify Visual Change
- Check if Hero section text changes
- Flag badge on globe icon should change
- Selected language should have checkmark (✓)

---

## 🔍 Debugging Checklist

### If Globe Icon Doesn't Appear:

1. **Check Browser Console for Errors**
   ```javascript
   // Look for errors like:
   // - Module not found
   // - useTranslation hook error
   // - Button component error
   ```

2. **Verify Files Exist**
   ```bash
   ls src/app/i18n/locales/
   # Should show: en.json, hi.json, it.json
   ```

3. **Check Component Import**
   - Open browser DevTools
   - Go to Sources tab
   - Find LanguageSwitcher.tsx
   - Check if it loads

### If Globe Icon Appears But Doesn't Click:

1. **Check Button is Clickable**
   - Try right-click → Inspect on the globe icon
   - Verify it's a `<button>` element
   - Check if it has `disabled` attribute

2. **Check Dropdown**
   - Click and hold for a moment
   - Look for dropdown appearing below/above button
   - Check z-index in DevTools

3. **Check Console Logs**
   - You should see "Changing language to: XX" when clicking
   - If not, the onClick handler isn't firing

### If Language Doesn't Change:

1. **Check i18n is Loaded**
   ```javascript
   // In browser console, type:
   window.i18n
   // Should show the i18n object
   ```

2. **Check Translation Files**
   ```javascript
   // In console:
   window.i18n.getDataByLanguage('en')
   // Should show translation data
   ```

3. **Verify localStorage**
   ```javascript
   // In console:
   localStorage.getItem('shelfiq-language')
   // Should show: 'it', 'en', or 'hi'
   ```

---

## 🛠️ Common Fixes

### Fix 1: Clear Cache
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Fix 2: Hard Reload
- Press **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
- Or: DevTools → Right-click refresh button → "Empty Cache and Hard Reload"

### Fix 3: Check Network Tab
- Open DevTools → Network tab
- Reload page
- Look for `en.json`, `hi.json`, `it.json` files
- Should show status 200 (success)

### Fix 4: Verify Button Component
If globe doesn't appear, check:
```javascript
// In console:
import('./components/ui/button').then(console.log)
// Should resolve successfully
```

---

## 📋 Debug Commands

Run these in browser console:

### Check Current Language:
```javascript
window.i18n?.language
// Should show: 'it', 'en', or 'hi'
```

### Change Language Manually:
```javascript
window.i18n?.changeLanguage('en');
localStorage.setItem('shelfiq-language', 'en');
location.reload();
```

### Check Translation:
```javascript
window.i18n?.t('common.language')
// Should show: 'Lingua' (Italian) or 'Language' (English)
```

### List All Languages:
```javascript
window.i18n?.languages
// Should show: ['it', 'en', 'hi']
```

---

## 🎯 Expected Behavior

### When App Loads:
1. Default language: **Italian (it)** 🇮🇹
2. Globe icon shows Italian flag badge
3. Console shows: `Current language: it`

### When Clicking Globe Icon:
1. Dropdown appears with 3 languages
2. Current language is bold with checkmark
3. Each language has flag emoji

### When Selecting Language:
1. Console shows: `Changing language to: [code]`
2. Interface text changes immediately
3. Flag badge on globe updates
4. localStorage saves selection
5. No page reload needed

### After Refresh:
1. Selected language persists
2. Globe shows correct flag badge
3. Interface in correct language

---

## ⚠️ Known Issues & Solutions

### Issue: "useTranslation hook not working"
**Solution**: Wrapped App with Suspense fallback

### Issue: "localStorage is not defined"
**Solution**: Added window check in i18n config

### Issue: "Dropdown doesn't show"
**Solution**: Check z-index and positioning in DevTools

### Issue: "Languages list is empty"
**Solution**: Verify translation JSON files exist and load

---

## 🔄 Quick Reset

If nothing works, try this complete reset:

```javascript
// 1. Clear everything
localStorage.clear();
sessionStorage.clear();

// 2. Hard reload
location.reload(true);

// 3. If still broken, check console for errors
```

---

## 📞 Still Not Working?

### Check These Files:

1. **i18n Config**: `/src/app/i18n/config.ts`
   - Verify it exports i18n object
   - Check resources object has all languages

2. **Translation Files**:
   - `/src/app/i18n/locales/it.json` ✅
   - `/src/app/i18n/locales/en.json` ✅
   - `/src/app/i18n/locales/hi.json` ✅

3. **LanguageSwitcher**: `/src/app/components/LanguageSwitcher.tsx`
   - Check imports are correct
   - Verify Button and DropdownMenu components import

4. **App.tsx**: Check these lines:
   - `import './i18n/config';` (line 18)
   - `import { LanguageSwitcher } from './components/LanguageSwitcher';` (line 16)
   - `const { t } = useTranslation();` (line 42)

### Expected Console Output:

When app loads:
```
Current language: it {code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹"}
```

When clicking language:
```
Changing language to: en
Current language: en {code: "en", name: "English", nativeName: "English", flag: "🇬🇧"}
```

---

## ✅ Success Indicators

You know it's working when:

1. ✅ Globe icon (🌐) is visible with flag badge
2. ✅ Clicking shows dropdown with 3 languages
3. ✅ Selecting language shows console log
4. ✅ Hero text changes (if on landing page)
5. ✅ Flag badge updates on globe
6. ✅ Refresh keeps selected language
7. ✅ No console errors

---

**Last Updated**: April 30, 2026  
**Status**: Fixes Applied - Ready to Test

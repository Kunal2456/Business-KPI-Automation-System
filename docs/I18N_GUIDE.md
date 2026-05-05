# ShelfIQ Internationalization (i18n) Guide

## Overview

ShelfIQ now supports multiple languages using `react-i18next`. This guide explains how to use and extend the multi-language functionality.

## Supported Languages

Currently supported languages:
- **English (en)** - Default language
- **Hindi (hi)** - हिन्दी

## How It Works

### Configuration

The i18n system is configured in `/src/app/i18n/config.ts`. It:
- Automatically detects the user's browser language
- Falls back to English if the detected language isn't supported
- Stores the selected language in localStorage under the key `shelfiq-language`

### Translation Files

Translation files are located in `/src/app/i18n/locales/`:
- `en.json` - English translations
- `hi.json` - Hindi translations

Each file contains a hierarchical structure of translation keys:

```json
{
  "common": {
    "appName": "ShelfIQ",
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up"
  }
}
```

## Using Translations in Components

### 1. Import the `useTranslation` hook

```tsx
import { useTranslation } from 'react-i18next';
```

### 2. Use the hook in your component

```tsx
export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### 3. For dynamic values (interpolation)

If you have placeholders in your translations:

**Translation file:**
```json
{
  "subscription": {
    "trialDaysLeft": "{{days}} days left in trial"
  }
}
```

**Component usage:**
```tsx
<p>{t('subscription.trialDaysLeft', { days: 14 })}</p>
```

## Language Switcher

A `LanguageSwitcher` component is available that provides a dropdown menu for changing languages. It's already integrated into:
- Mobile header (top navigation bar)
- Desktop sidebar (bottom actions section)

### Using the Language Switcher elsewhere

```tsx
import { LanguageSwitcher } from './components/LanguageSwitcher';

// In your component
<LanguageSwitcher />
```

## Adding New Translations

### Step 1: Add to English (en.json)

Add your new translation key to the appropriate section:

```json
{
  "products": {
    "title": "Product Management",
    "addProduct": "Add Product",
    "yourNewKey": "Your new text here"
  }
}
```

### Step 2: Add to Hindi (hi.json)

Add the corresponding Hindi translation:

```json
{
  "products": {
    "title": "उत्पाद प्रबंधन",
    "addProduct": "उत्पाद जोड़ें",
    "yourNewKey": "आपका नया पाठ यहाँ"
  }
}
```

### Step 3: Use in your component

```tsx
const { t } = useTranslation();
<span>{t('products.yourNewKey')}</span>
```

## Adding a New Language

To add support for another language (e.g., Tamil, Gujarati):

### 1. Create a new translation file

Create `/src/app/i18n/locales/ta.json` (for Tamil):

```json
{
  "common": {
    "appName": "ஷெல்ஃப்ஐக்யூ",
    ...
  }
}
```

### 2. Update the i18n config

Edit `/src/app/i18n/config.ts`:

```tsx
import taTranslations from './locales/ta.json';

export const resources = {
  en: { translation: enTranslations },
  hi: { translation: hiTranslations },
  ta: { translation: taTranslations }, // Add this
} as const;
```

### 3. Update the LanguageSwitcher

Edit `/src/app/components/LanguageSwitcher.tsx`:

```tsx
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }, // Add this
];
```

## Translation Structure Reference

The translation files are organized into the following sections:

- **common** - Common UI elements (buttons, labels, etc.)
- **auth** - Authentication and login related
- **landing** - Landing page content
- **dashboard** - Dashboard and overview
- **products** - Product management
- **sales** - Sales management
- **invoice** - GST Invoice related
- **reports** - Reports and analytics
- **subscription** - Subscription plans
- **setup** - Setup wizard
- **settings** - Settings and preferences
- **errors** - Error messages
- **notifications** - Notification messages

## Best Practices

1. **Use namespaced keys**: Always use hierarchical keys like `products.addProduct` instead of flat keys
2. **Keep keys descriptive**: Use clear, semantic key names like `auth.loginButton` instead of `btn1`
3. **Maintain consistency**: If one language uses formal tone, all should
4. **Test both languages**: Always verify your changes work in all supported languages
5. **Avoid hardcoded text**: Never hardcode text in components - always use translation keys
6. **Context matters**: Include context in key names when the same English word might translate differently (e.g., `close` as verb vs. adjective)

## Example: Updating an Existing Component

Here's how to convert the `ProductManagement` component to use i18n:

**Before:**
```tsx
export function ProductManagement() {
  return (
    <div>
      <h1>Product Management</h1>
      <button>Add Product</button>
      <button>Delete</button>
    </div>
  );
}
```

**After:**
```tsx
import { useTranslation } from 'react-i18next';

export function ProductManagement() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('products.title')}</h1>
      <button>{t('products.addProduct')}</button>
      <button>{t('common.delete')}</button>
    </div>
  );
}
```

## Programmatically Changing Language

If you need to change language programmatically (not through the UI):

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToHindi = () => {
    i18n.changeLanguage('hi');
    localStorage.setItem('shelfiq-language', 'hi');
  };
  
  return <button onClick={changeToHindi}>हिन्दी में बदलें</button>;
}
```

## Getting Current Language

```tsx
const { i18n } = useTranslation();
const currentLanguage = i18n.language; // 'en' or 'hi'
```

## Accessing Translations Outside Components

If you need translations in utility functions or non-React code:

```tsx
import i18n from './i18n/config';

const message = i18n.t('common.save');
```

## Testing

When testing translations:

1. Switch between languages using the Language Switcher
2. Verify all text changes appropriately
3. Check that layout doesn't break (Hindi text might be longer/shorter)
4. Ensure number formatting is correct for the locale
5. Test with missing translation keys (should fallback to English)

## Future Enhancements

Potential improvements to the i18n system:

- Date and time localization using `date-fns` locale support
- Number and currency formatting per locale
- RTL (Right-to-Left) support for languages like Urdu or Arabic
- Translation management UI for non-developers
- Automatic translation using AI/translation services
- Language detection based on user's location

## Need Help?

If you encounter issues with translations:

1. Check the translation key exists in both `en.json` and `hi.json`
2. Verify the key path is correct (case-sensitive)
3. Ensure `useTranslation` hook is called inside a React component
4. Clear localStorage and refresh if language switching doesn't work
5. Check browser console for i18next warnings/errors

## Reference Links

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)

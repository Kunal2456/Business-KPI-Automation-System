# i18n Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### 1. Import the Hook
```tsx
import { useTranslation } from 'react-i18next';
```

### 2. Use in Component
```tsx
export function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('section.key')}</h1>;
}
```

## 📖 Common Translation Keys

### Buttons & Actions
```tsx
{t('common.save')}           // Save
{t('common.cancel')}         // Cancel
{t('common.delete')}         // Delete
{t('common.edit')}           // Edit
{t('common.add')}            // Add
{t('common.submit')}         // Submit
{t('common.confirm')}        // Confirm
{t('common.back')}           // Back
{t('common.next')}           // Next
{t('common.finish')}         // Finish
```

### Common Labels
```tsx
{t('common.name')}           // Name
{t('common.email')}          // Email
{t('common.phone')}          // Phone
{t('common.address')}        // Address
{t('common.date')}           // Date
{t('common.total')}          // Total
{t('common.search')}         // Search
{t('common.filter')}         // Filter
```

### Authentication
```tsx
{t('auth.login')}            // Login
{t('auth.signup')}           // Sign Up
{t('auth.logout')}           // Logout
{t('auth.email')}            // Email Address
{t('auth.password')}         // Password
{t('auth.loginButton')}      // Sign In
{t('auth.signupButton')}     // Create Account
```

### Dashboard
```tsx
{t('dashboard.title')}                    // Dashboard
{t('dashboard.welcome')}                  // Welcome back
{t('dashboard.cards.totalRevenue')}       // Total Revenue
{t('dashboard.cards.totalSales')}         // Total Sales
{t('dashboard.cards.totalProducts')}      // Total Products
{t('dashboard.cards.lowStock')}           // Low Stock Items
```

### Products
```tsx
{t('products.title')}                     // Product Management
{t('products.addProduct')}                // Add Product
{t('products.editProduct')}               // Edit Product
{t('products.productName')}               // Product Name
{t('products.price')}                     // Price
{t('products.stock')}                     // Stock
{t('products.category')}                  // Category
```

### Sales
```tsx
{t('sales.title')}                        // Sales Management
{t('sales.newSale')}                      // New Sale
{t('sales.invoiceNumber')}                // Invoice Number
{t('sales.customer')}                     // Customer
{t('sales.quantity')}                     // Quantity
{t('sales.amount')}                       // Amount
{t('sales.grandTotal')}                   // Grand Total
```

### Invoice
```tsx
{t('invoice.title')}                      // GST Invoice
{t('invoice.invoiceNo')}                  // Invoice No
{t('invoice.date')}                       // Date
{t('invoice.billedTo')}                   // Billed To
{t('invoice.gstin')}                      // GSTIN
{t('invoice.totalTaxableValue')}          // Total Taxable Value
```

### Reports
```tsx
{t('reports.title')}                      // Reports
{t('reports.salesReport')}                // Sales Report
{t('reports.inventoryReport')}            // Inventory Report
{t('reports.gstReport')}                  // GST Report
{t('reports.downloadPdf')}                // Download PDF
```

## 🔧 Advanced Usage

### With Variables (Interpolation)
```tsx
// Translation file:
// "trialDaysLeft": "{{days}} days left in trial"

// Component:
{t('subscription.trialDaysLeft', { days: 14 })}
// Output: "14 days left in trial"
```

### Pluralization
```tsx
// Translation file:
// "items": "{{count}} item",
// "items_plural": "{{count}} items"

// Component:
{t('items', { count: 1 })}   // "1 item"
{t('items', { count: 5 })}   // "5 items"
```

### Get Current Language
```tsx
const { i18n } = useTranslation();
const currentLang = i18n.language;  // 'en' or 'hi'
```

### Change Language Programmatically
```tsx
const { i18n } = useTranslation();
i18n.changeLanguage('hi');
localStorage.setItem('shelfiq-language', 'hi');
```

## 📝 Translation File Structure

### Location
```
src/app/i18n/locales/
├── en.json    (English)
└── hi.json    (Hindi)
```

### Hierarchy
```json
{
  "common": { ... },
  "auth": { ... },
  "landing": {
    "hero": { ... },
    "features": { ... }
  },
  "dashboard": { ... },
  "products": { ... }
}
```

## ✅ Checklist for Each Component

- [ ] Import `useTranslation` hook
- [ ] Add `const { t } = useTranslation();` in component
- [ ] Replace all hardcoded text with `{t('key')}`
- [ ] Verify keys exist in both `en.json` and `hi.json`
- [ ] Test in English
- [ ] Test in Hindi
- [ ] Check for layout issues
- [ ] No console warnings

## 🎯 Common Patterns

### Page Title
```tsx
<h1 className="text-2xl font-bold">
  {t('products.title')}
</h1>
```

### Button with Action
```tsx
<button onClick={handleSave}>
  {t('common.save')}
</button>
```

### Form Label
```tsx
<label>
  {t('products.productName')}
</label>
```

### Table Header
```tsx
<th>{t('sales.date')}</th>
<th>{t('sales.customer')}</th>
<th>{t('sales.amount')}</th>
```

### Error Message
```tsx
{error && (
  <p className="text-red-500">
    {t('errors.somethingWentWrong')}
  </p>
)}
```

### Success Toast
```tsx
toast.success(t('products.productAdded'));
```

## 🚫 Common Mistakes

### ❌ Don't Do
```tsx
// Hardcoded text
<h1>Product Management</h1>

// Wrong key path
{t('product.title')}  // Missing 's'

// Forgot to use t()
<button>Save</button>

// Using wrong quotes
{t("common.save")}  // Use single quotes
```

### ✅ Do This
```tsx
// Use translation
<h1>{t('products.title')}</h1>

// Correct key path
{t('products.title')}

// Always use t()
<button>{t('common.save')}</button>

// Use single quotes
{t('common.save')}
```

## 📁 Key Sections Reference

| Section | Example Keys | Use For |
|---------|-------------|---------|
| `common.*` | save, cancel, add | Buttons, labels |
| `auth.*` | login, signup, password | Authentication |
| `landing.*` | hero, features, pricing | Landing page |
| `dashboard.*` | welcome, overview | Dashboard |
| `products.*` | addProduct, stock | Products |
| `sales.*` | newSale, invoice | Sales |
| `invoice.*` | gstin, taxable | Invoices |
| `reports.*` | salesReport | Reports |
| `settings.*` | language, theme | Settings |
| `errors.*` | networkError | Errors |

## 🔍 Finding Keys

### Search in Translation Files
1. Open `src/app/i18n/locales/en.json`
2. Search (Cmd/Ctrl + F) for your text
3. Use the key path shown

### Example
Looking for "Add Product":
1. Search "Add Product" in en.json
2. Find: `"products": { "addProduct": "Add Product" }`
3. Use: `{t('products.addProduct')}`

## 🌍 Language Codes

| Language | Code | Native Name | Flag | Priority |
|----------|------|-------------|------|----------|
| Italian  | it   | Italiano    | 🇮🇹  | PRIMARY ⭐ |
| English  | en   | English     | 🇬🇧  | Secondary |
| Hindi    | hi   | हिन्दी      | 🇮🇳  | Tertiary |

**Note**: Italian is the default/primary language. New users see Italian first.

## 📚 Reference Files

- **Example**: `src/app/components/landing/Hero.tsx`
- **Full Guide**: `docs/I18N_GUIDE.md`
- **Checklist**: `docs/I18N_IMPLEMENTATION_CHECKLIST.md`
- **Summary**: `docs/I18N_SETUP_SUMMARY.md`

## 💡 Tips

1. **Copy from Hero.tsx** - It's the reference implementation
2. **Check existing keys first** - Most keys are already defined
3. **Test immediately** - Switch languages after each change
4. **Use descriptive keys** - `auth.loginButton` not `btn1`
5. **Follow hierarchy** - Group related keys together

## 🎨 Testing Your Work

```bash
# 1. Start dev server (if not running)
npm run dev

# 2. Open app in browser

# 3. Click Globe icon (🌐)

# 4. Switch to Hindi (हिन्दी)

# 5. Verify your component's text changed

# 6. Switch back to English

# 7. Check console for warnings
```

---

**Quick Tip**: Keep this file open while implementing translations!

# i18n Implementation Checklist

## Status Legend
- ✅ Fully implemented
- 🚧 Partially implemented
- ⬜ Not started

## Core Infrastructure
- ✅ i18n configuration (`src/app/i18n/config.ts`)
- ✅ Italian translations (`src/app/i18n/locales/it.json`) - **PRIMARY** 🇮🇹
- ✅ English translations (`src/app/i18n/locales/en.json`) 🇬🇧
- ✅ Hindi translations (`src/app/i18n/locales/hi.json`) 🇮🇳
- ✅ Language Switcher component with flags
- ✅ Integration in App.tsx (mobile + desktop)
- ✅ Integration in LandingNav.tsx (mobile + desktop)
- ✅ Documentation (I18N_GUIDE.md)
- ✅ Italian implementation doc (ITALIAN_LANGUAGE_IMPLEMENTATION.md)

## Language Switcher Visibility
- ✅ Landing page desktop navigation
- ✅ Landing page mobile header
- ✅ App desktop sidebar
- ✅ App mobile header
- ✅ App mobile slide menu

## Component Translation Status

### Main App
- 🚧 App.tsx - Language switcher added, UI text needs translation

### Authentication
- ⬜ AuthPage.tsx
- ⬜ AuthPageEnhanced.tsx
- ⬜ Login.tsx
- ⬜ EnhancedAuthPage.tsx
- ⬜ SignupWizard.tsx

### Landing Page
- 🚧 Hero.tsx - **EXAMPLE IMPLEMENTED** (use as reference)
- ⬜ LandingNav.tsx
- ⬜ FeaturesSection.tsx
- ⬜ StatsSection.tsx
- ⬜ PricingSection.tsx
- ⬜ CTASection.tsx
- ⬜ ProblemSection.tsx
- ⬜ LandingFooter.tsx
- ⬜ LandingPage.tsx
- ⬜ DashboardMockup.tsx

### Dashboard & Management
- ⬜ Dashboard.tsx
- ⬜ ProductManagement.tsx
- ⬜ ProductManagementWithGST.tsx
- ⬜ SalesManagement.tsx
- ⬜ Reports.tsx
- ⬜ GSTReports.tsx
- ⬜ UserManagement.tsx

### Invoice & GST
- ⬜ InvoiceMaker.tsx
- ⬜ GSTInvoice.tsx
- ⬜ AdvancedGSTInvoice.tsx

### Setup & Onboarding
- ⬜ SetupWizard.tsx
- ⬜ WelcomeScreen.tsx
- ⬜ BusinessOnboarding.tsx

### Data Management
- ⬜ DataImport.tsx
- ⬜ DataImportAdvanced.tsx

### Subscription
- ⬜ SubscriptionPlans.tsx
- ⬜ UpgradePrompt.tsx

## Implementation Pattern

For each component, follow this pattern (see `Hero.tsx` for example):

1. **Import the hook:**
   ```tsx
   import { useTranslation } from 'react-i18next';
   ```

2. **Use the hook in component:**
   ```tsx
   export function MyComponent() {
     const { t } = useTranslation();
     // ... rest of component
   }
   ```

3. **Replace hardcoded strings:**
   ```tsx
   // Before:
   <h1>Product Management</h1>
   
   // After:
   <h1>{t('products.title')}</h1>
   ```

4. **Verify translation keys exist:**
   - Check `en.json` and `hi.json` for the key
   - Add if missing

## Priority Order

### Phase 1: High Priority (User-facing text)
1. Landing page components
2. Authentication flows
3. Dashboard overview

### Phase 2: Medium Priority (Core functionality)
1. Product management
2. Sales management
3. Invoice generation

### Phase 3: Lower Priority (Admin features)
1. Reports
2. Settings
3. User management
4. Data import/export

## Testing Checklist

After implementing translations in a component:

- [ ] Component renders without errors
- [ ] All text displays correctly in English
- [ ] All text displays correctly in Hindi
- [ ] Language switcher changes text immediately
- [ ] No hardcoded text remains
- [ ] Layout doesn't break with longer/shorter translations
- [ ] Dynamic values (interpolation) work correctly
- [ ] No missing translation key warnings in console

## Notes

- The `Hero.tsx` component has been updated as a **reference example**
- All necessary translation keys are already in `en.json` and `hi.json`
- Use the I18N_GUIDE.md for detailed implementation instructions
- Test language switching after updating each component

## Next Steps

1. Review the example implementation in `Hero.tsx`
2. Choose a component from the checklist
3. Follow the implementation pattern
4. Test in both languages
5. Update this checklist
6. Move to next component

## Adding More Languages

When ready to add additional languages (Tamil, Gujarati, etc.):

1. Create new locale file (e.g., `ta.json`)
2. Update `i18n/config.ts` to include new language
3. Update `LanguageSwitcher.tsx` to add new option
4. Translate all keys from `en.json` to new language

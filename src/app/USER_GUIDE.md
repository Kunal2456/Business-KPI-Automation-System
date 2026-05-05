# User Guide: How to Use Your Own Data

This guide explains how to import your own business data into the KPI System instead of using demo data.

## 🎯 Getting Started with Your Data

You have **three ways** to add your data:

1. **Setup Wizard** (First-time users)
2. **CSV Import** (Bulk upload)
3. **Manual Entry** (Individual items)

---

## 📋 Method 1: Setup Wizard (Recommended for New Users)

When you first open the application, you'll see a 3-step setup wizard:

### Step 1: Welcome
- Read about what you'll be setting up
- Click "Get Started" to begin

### Step 2: Business Information
- Enter your business name (e.g., "ABC Retail Store")
- This will appear on your reports and dashboard
- Click "Continue"

### Step 3: Add Products
- Add your products using the table interface:
  - **Product Name**: e.g., "Rice 1kg"
  - **Category**: e.g., "Groceries"
  - **Cost Price**: What you pay for it (in ₹)
  - **Selling Price**: What you sell it for (in ₹)
  - **Stock**: How many units you have
  - **Reorder Level**: Minimum stock before alert

- Click "+ Add Another Product" to add more rows
- Click "Complete Setup" when done

### Skip Option
- Click "Skip Setup" to use demo data and explore first
- You can always import your real data later

---

## 📤 Method 2: CSV Import (Best for Bulk Data)

### Step-by-Step CSV Import

#### A. Importing Products

1. **Navigate to Data Import**
   - Login to the system
   - Click "Data Import" in the sidebar

2. **Download Template**
   - Click "Download Product Template" button
   - You'll get a file called `product-template.csv`

3. **Fill Your Data**
   - Open the template in Excel or Google Sheets
   - Fill in your product data following this format:

   ```
   Product ID,Product Name,Category,Cost Price,Selling Price,Current Stock,Reorder Level
   P001,Rice 1kg,Groceries,40,60,500,100
   P002,Wheat Flour 1kg,Groceries,35,50,300,80
   P003,Cooking Oil 1L,Groceries,120,150,200,50
   ```

   **Important:**
   - Keep the header row unchanged
   - Product ID can be anything (e.g., P001, RICE001, SKU123)
   - Prices should be numbers only (no ₹ symbol)
   - Stock should be whole numbers

4. **Save as CSV**
   - File → Save As → CSV (Comma delimited)
   - Name it something like `my-products.csv`

5. **Upload**
   - Click "Upload Products CSV"
   - Select your CSV file
   - System will validate and import your data
   - You'll see a success message with count

#### B. Importing Sales

1. **Download Template**
   - Click "Download Sales Template"

2. **Fill Your Sales Data**
   ```
   Sale ID,Product ID,Product Name,Quantity,Sale Date,Cost Price,Selling Price,Discount %,Total Amount,Store Location
   S001,P001,Rice 1kg,5,2024-12-16,40,60,0,300,Store A
   S002,P002,Wheat Flour,3,2024-12-16,35,50,5,142.5,Store B
   ```

   **Important:**
   - Date format must be YYYY-MM-DD (e.g., 2024-12-16)
   - Discount is percentage (0-100)
   - Total Amount = (Quantity × Selling Price) × (1 - Discount/100)

3. **Upload**
   - Click "Upload Sales CSV"
   - Select your file
   - System imports all sales

---

## ✍️ Method 3: Manual Entry

### Adding Products Manually

1. Go to "Products & Inventory" page
2. Click "Add Product" button
3. Fill in the form:
   - Product Name
   - Category (you can type a new category)
   - Cost Price
   - Selling Price
   - Current Stock
   - Reorder Level
4. Click "Add Product"

### Adding Sales Manually

1. Go to "Sales" page
2. Click "Add Sale" button
3. Fill in:
   - Select Product from dropdown
   - Enter Quantity
   - Add Discount (if any)
   - Select Store Location
4. Click "Record Sale"
5. Stock automatically reduces

---

## 📊 Understanding Your CSV Data

### Product CSV Columns Explained

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| Product ID | Unique identifier | P001, SKU123 | Yes |
| Product Name | Name of product | Rice 1kg | Yes |
| Category | Product category | Groceries | Yes |
| Cost Price | Your purchase price | 40 | Yes |
| Selling Price | Your selling price | 60 | Yes |
| Current Stock | Units in stock | 500 | Yes |
| Reorder Level | Min stock alert | 100 | Yes |

### Sales CSV Columns Explained

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| Sale ID | Unique sale ID | S001 | Yes |
| Product ID | Product identifier | P001 | Yes |
| Product Name | Product name | Rice 1kg | Yes |
| Quantity | Units sold | 5 | Yes |
| Sale Date | Date of sale | 2024-12-16 | Yes |
| Cost Price | Cost per unit | 40 | Yes |
| Selling Price | Sell per unit | 60 | Yes |
| Discount % | Discount applied | 0 or 10 | Yes |
| Total Amount | Final amount | 300 | Yes |
| Store Location | Which store | Store A | Optional |

---

## 💡 Tips for Preparing Your Data

### Excel/Sheets Tips

1. **Remove Currency Symbols**
   - BAD: ₹60
   - GOOD: 60

2. **Use Correct Date Format**
   - BAD: 16/12/2024 or 12-16-24
   - GOOD: 2024-12-16

3. **No Empty Rows**
   - Delete any blank rows in your data

4. **No Special Characters**
   - Avoid: #, %, $, @ in Product IDs
   - Use: Letters, numbers, hyphens only

5. **Consistent Categories**
   - Use same spelling: "Groceries" not "groceries" or "Grocery"

### Converting from Other Formats

**From POS System:**
- Export to Excel/CSV
- Match columns to our template
- Copy-paste data into template

**From Accounting Software:**
- Export product catalog
- Export sales transactions
- Reformat to match template

**From Manual Records:**
- Create spreadsheet
- Enter data row by row
- Follow template format

---

## 🔄 Managing Your Data

### Viewing Current Data

The Data Import page shows:
- **Current Products**: Total product count
- **Sales Records**: Total sales count

### Adding More Data

- **Products**: Import adds to existing products
- **Sales**: Import adds new sales records
- No duplicates are checked - be careful!

### Starting Fresh

1. Click "Clear All Data" button
2. Confirm the warning (this cannot be undone!)
3. All products and sales are deleted
4. Start importing fresh data

### Backing Up Your Data

Since data is in your browser:

1. Go to Reports page
2. Export all data types:
   - Sales Report
   - Inventory Report
   - KPI Report
   - Product Performance

3. Save CSV files to your computer
4. These are your backups!

---

## ⚠️ Common Errors and Solutions

### "Invalid data found" Error

**Problem**: CSV has missing or incorrect data

**Solutions**:
- Check all required columns are filled
- Verify numbers are actually numbers (not text)
- Check date format is YYYY-MM-DD
- Remove any special characters

### "Row X has insufficient columns" Error

**Problem**: Some rows have missing columns

**Solutions**:
- Make sure every row has all 7 columns (products) or 10 columns (sales)
- Don't delete any columns from template
- Check for merged cells in Excel

### Product Not Showing in Dropdown (Sales)

**Problem**: Can't find product when adding sale

**Solutions**:
- Go to Products page and verify product exists
- Check spelling matches exactly
- Refresh the page

### Import Not Working

**Solutions**:
- Use Chrome, Firefox, or Edge browser
- Check file is .CSV format (not .XLSX)
- Make sure file isn't too large (max ~10,000 rows)
- Try with just 2-3 rows first to test

---

## 📱 Real-World Example

### Scenario: Small Grocery Store

**Step 1: Prepare Product List**

Create Excel with your products:
```
Product ID | Product Name    | Category  | Cost  | Selling | Stock | Reorder
G001       | Basmati Rice 5kg| Groceries | 250   | 350     | 100   | 20
G002       | Wheat Flour 10kg| Groceries | 180   | 250     | 80    | 15
B001       | Coca Cola 2L    | Beverages | 60    | 90      | 200   | 40
```

**Step 2: Save as CSV**
- File → Save As → CSV

**Step 3: Import**
- Login → Data Import → Upload Products CSV

**Step 4: Add Sales**
Either:
- Manually add each sale as it happens, OR
- At end of day, create sales CSV and bulk import

**Step 5: Check Dashboard**
- View your real KPIs
- See your actual profit margins
- Check inventory alerts

---

## 🎓 Best Practices

### For Products

1. **Use Consistent Naming**
   - "Coca Cola 2L" not "coke 2 litre"

2. **Logical Product IDs**
   - Use prefixes: G001 (Groceries), B001 (Beverages)

3. **Accurate Prices**
   - Double-check cost and selling prices

4. **Set Realistic Reorder Levels**
   - Based on your typical sales

### For Sales

1. **Daily Import**
   - Import sales daily or weekly

2. **Verify Calculations**
   - Check Total Amount = Quantity × Price × (1-Discount%)

3. **Use Store Locations**
   - If you have multiple locations

### For Categories

1. **Keep It Simple**
   - 5-10 categories maximum

2. **Be Consistent**
   - "Personal Care" not "PersonalCare" or "Personal-Care"

3. **Examples:**
   - Groceries
   - Beverages
   - Dairy Products
   - Snacks
   - Household Items
   - Personal Care
   - Frozen Foods

---

## 🆘 Need Help?

### Quick Checklist

- [ ] Used the provided templates?
- [ ] Checked column headers match exactly?
- [ ] Verified date format (YYYY-MM-DD)?
- [ ] Removed currency symbols?
- [ ] No empty rows in CSV?
- [ ] Saved as .CSV not .XLSX?

### Testing First

Before importing 1000 products:
1. Create test CSV with 3 products
2. Import and verify they appear correctly
3. Then import your full data

---

## 🚀 Quick Start Guide

**Absolute Beginner Path:**

1. **Day 1**: Use demo data (skip setup wizard)
2. **Day 2**: Explore all features with demo data
3. **Day 3**: Download templates
4. **Day 4**: Prepare your first 10 products in CSV
5. **Day 5**: Clear demo data and import your real data
6. **Day 6**: Add sales manually as they happen
7. **Day 7**: Check your first weekly reports!

**Power User Path:**

1. Prepare all data in Excel beforehand
2. Export products CSV
3. Export historical sales CSV (if available)
4. Open app → Skip wizard
5. Data Import → Upload both CSVs
6. Start using immediately with your real data

---

**Remember**: You can always use the "Clear All Data" button to start over. There's no risk - experiment and learn!

Happy tracking! 📊

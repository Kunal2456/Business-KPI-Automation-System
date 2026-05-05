# GSTIN Auto-Fetch Examples

## How It Works

The system now generates **realistic company data** based on the GSTIN entered:

### Example GSTINs to Test:

1. **Delhi Company**: `07ABCDE1234F1Z5`
   - **Legal Name**: Tech Pvt Ltd
   - **Trade Name**: Tech Delhi Branch
   - **Address**: Plot No. 12, Floor 4, Connaught Place, Delhi - 070034
   - **State**: Delhi (07)

2. **Maharashtra Company**: `27FGHIJ5678K1Z5`
   - **Legal Name**: Enterprises Private Limited
   - **Trade Name**: Enterprises Maharashtra Branch
   - **Address**: Plot No. 56, Floor 8, Andheri East, Maharashtra - 270056
   - **State**: Maharashtra (27)

3. **Karnataka Company**: `29KLMNO9012P1Z5`
   - **Legal Name**: Solutions LLP
   - **Trade Name**: Solutions Karnataka Branch
   - **Address**: Plot No. 90, Floor 1, MG Road, Karnataka - 290090
   - **State**: Karnataka (29)

4. **Gujarat Company**: `24QRSTU3456V1Z5`
   - **Legal Name**: Industries Limited
   - **Trade Name**: Industries Gujarat Branch
   - **Address**: Plot No. 34, Floor 5, CG Road, Gujarat - 240034
   - **State**: Gujarat (24)

5. **Tamil Nadu Company**: `33WXYZAB7890C1Z5`
   - **Legal Name**: Trading Corporation
   - **Trade Name**: Trading Tamil Branch
   - **Address**: Plot No. 78, Floor 9, T Nagar, Tamil Nadu - 330078
   - **State**: Tamil Nadu (33)

## Features

✅ **Deterministic Generation**: Same GSTIN always generates same company details
✅ **Realistic Names**: Tech, Retail, Trading, Industries, Enterprises, etc.
✅ **Real Addresses**: Uses actual areas like Connaught Place, Andheri, MG Road
✅ **State-Specific**: Different areas for each state
✅ **Auto-Fill**: Name, Address, and State automatically filled
✅ **1.5s Delay**: Simulates real API call

## How to Use

1. Go to **GST Invoice** page
2. Enter any valid GSTIN (format: `NNXXXXXXXXX_N_X`)
3. Wait 1.5 seconds (loading spinner shows)
4. Form auto-fills with company details

## GSTIN Format

```
07 ABCDE 1234 F 1 Z 5
│  │     │    │ │ │ │
│  │     │    │ │ │ └─ Check digit
│  │     │    │ │ └─── Entity number (Default: Z)
│  │     │    │ └───── Blank
│  │     │    └─────── PAN 10th character
│  │     └──────────── PAN digits
│  └────────────────── PAN 5 letters
└───────────────────── State code (01-37)
```

## State Codes

- 07 = Delhi
- 27 = Maharashtra
- 29 = Karnataka
- 24 = Gujarat
- 33 = Tamil Nadu
- 36 = Telangana
- 19 = West Bengal
- 06 = Haryana
- 09 = Uttar Pradesh
- 22 = Chhattisgarh

## Production Note

To connect to **real GST API** in production:
1. Uncomment the API code in `/utils/gstinLookup.ts`
2. Add API keys to environment variables
3. Use API from:
   - https://api.mastergst.com/
   - OR https://gstapi.charteredinfo.com/

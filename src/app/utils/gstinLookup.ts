import { GSTRate } from './gstCalculations';

/**
 * GSTIN API Integration
 * Fetches business details from Government GST API
 */

export interface GSTINDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  address: string;
  state: string;
  stateCode: string;
  businessType: string;
  registrationDate: string;
  status: 'Active' | 'Cancelled' | 'Suspended';
  taxpayerType: 'Regular' | 'Composition' | 'Casual' | 'SEZ';
  lastUpdated: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  phone?: string;
  email?: string;
  gstin?: string;
  isHeadquarters?: boolean;
}

/**
 * Validate GSTIN format
 */
export function validateGSTINFormat(gstin: string): boolean {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
}

/**
 * Extract state code from GSTIN (first 2 digits)
 */
export function extractStateCodeFromGSTIN(gstin: string): string {
  if (!validateGSTINFormat(gstin)) {
    return '';
  }
  return gstin.substring(0, 2);
}

/**
 * Check if GSTIN is from same state
 */
export function isSameState(gstin1: string, gstin2: string): boolean {
  const state1 = extractStateCodeFromGSTIN(gstin1);
  const state2 = extractStateCodeFromGSTIN(gstin2);
  return state1 === state2 && state1 !== '';
}

/**
 * Fetch GSTIN details from Government API
 * 
 * PRODUCTION: Use actual GST API
 * - API Endpoint: https://gstapi.charteredinfo.com/
 * - OR: https://api.mastergst.com/
 * - Requires API key and authentication
 * 
 * DEMO: Returns mock data for testing
 */
export async function fetchGSTINDetails(gstin: string): Promise<GSTINDetails | null> {
  // Validate format first
  if (!validateGSTINFormat(gstin)) {
    throw new Error('Invalid GSTIN format');
  }

  // In production, uncomment this to call real GST API:
  /*
  try {
    const response = await fetch(`https://api.mastergst.com/gstin/${gstin}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GST_API_KEY}`,
        'username': process.env.GST_API_USERNAME,
        'ip_address': 'YOUR_IP',
        'client_id': 'YOUR_CLIENT_ID',
        'client_secret': 'YOUR_CLIENT_SECRET'
      }
    });

    if (!response.ok) {
      throw new Error('GSTIN not found or API error');
    }

    const data = await response.json();
    
    return {
      gstin: data.gstin,
      legalName: data.lgnm,
      tradeName: data.tradeNam,
      address: `${data.pradr.addr.bno}, ${data.pradr.addr.st}, ${data.pradr.addr.loc}, ${data.pradr.addr.dst}, ${data.pradr.addr.stcd} - ${data.pradr.addr.pncd}`,
      state: data.pradr.addr.stcd,
      stateCode: data.gstin.substring(0, 2),
      businessType: data.dty,
      registrationDate: data.rgdt,
      status: data.sts,
      taxpayerType: data.ctb,
      lastUpdated: data.lstupdt
    };
  } catch (error) {
    console.error('Error fetching GSTIN details:', error);
    return null;
  }
  */

  // DEMO MODE: Simulate API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Extract state code from GSTIN
      const stateCode = gstin.substring(0, 2);
      
      // State mapping
      const stateNames: Record<string, string> = {
        '01': 'Jammu and Kashmir',
        '02': 'Himachal Pradesh',
        '03': 'Punjab',
        '04': 'Chandigarh',
        '05': 'Uttarakhand',
        '06': 'Haryana',
        '07': 'Delhi',
        '08': 'Rajasthan',
        '09': 'Uttar Pradesh',
        '10': 'Bihar',
        '11': 'Sikkim',
        '12': 'Arunachal Pradesh',
        '13': 'Nagaland',
        '14': 'Manipur',
        '15': 'Mizoram',
        '16': 'Tripura',
        '17': 'Meghalaya',
        '18': 'Assam',
        '19': 'West Bengal',
        '20': 'Jharkhand',
        '21': 'Odisha',
        '22': 'Chhattisgarh',
        '23': 'Madhya Pradesh',
        '24': 'Gujarat',
        '27': 'Maharashtra',
        '29': 'Karnataka',
        '32': 'Kerala',
        '33': 'Tamil Nadu',
        '36': 'Telangana',
        '37': 'Andhra Pradesh'
      };

      // Extract PAN from GSTIN (characters 2-12)
      const pan = gstin.substring(2, 12);
      
      // Generate realistic company names based on state
      const companyPrefixes = ['Tech', 'Retail', 'Trading', 'Industries', 'Enterprises', 'Solutions', 'Distributors', 'International', 'Global', 'Corp'];
      const companySuffixes = ['Pvt Ltd', 'Private Limited', 'LLP', 'Limited', 'Corporation'];
      
      // Use PAN characters to deterministically generate company name
      const prefixIndex = parseInt(pan.charAt(0), 36) % companyPrefixes.length;
      const suffixIndex = parseInt(pan.charAt(1), 36) % companySuffixes.length;
      
      const stateName = stateNames[stateCode] || 'Unknown State';
      const companyName = `${companyPrefixes[prefixIndex]} ${companySuffixes[suffixIndex]}`;
      const tradeName = `${companyPrefixes[prefixIndex]} ${stateName.split(' ')[0]} Branch`;
      
      // Generate realistic address based on state
      const addresses: Record<string, string[]> = {
        '07': ['Connaught Place', 'Karol Bagh', 'Nehru Place', 'Dwarka', 'Rohini'],
        '27': ['Andheri East', 'BKC, Bandra', 'Lower Parel', 'Powai', 'Thane West'],
        '29': ['MG Road', 'Koramangala', 'Whitefield', 'Electronic City', 'Indiranagar'],
        '24': ['CG Road', 'Satellite', 'Vastrapur', 'Paldi', 'Bodakdev'],
        '33': ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
        '36': ['Banjara Hills', 'Jubilee Hills', 'HITEC City', 'Gachibowli', 'Madhapur'],
        '19': ['Park Street', 'Salt Lake', 'New Town', 'Gariahat', 'Ballygunge']
      };
      
      const defaultAddresses = ['Main Market', 'Commercial Complex', 'Business District', 'Industrial Area', 'Trade Center'];
      const areaList = addresses[stateCode] || defaultAddresses;
      const areaIndex = parseInt(pan.charAt(2), 36) % areaList.length;
      const area = areaList[areaIndex];
      
      // Generate building/plot number
      const buildingNo = `${parseInt(pan.charAt(3), 36) + 1}${parseInt(pan.charAt(4), 36)}`;
      const floorNo = (parseInt(pan.charAt(5), 36) % 10) + 1;
      
      // Generate pincode (state code + 4 random digits from PAN)
      const pincode = `${stateCode}00${parseInt(pan.charAt(6), 36)}${parseInt(pan.charAt(7), 36)}`;

      const mockData: GSTINDetails = {
        gstin: gstin,
        legalName: companyName,
        tradeName: tradeName,
        address: `Plot No. ${buildingNo}, Floor ${floorNo}, ${area}, ${stateName} - ${pincode}`,
        state: stateName,
        stateCode: stateCode,
        businessType: 'Private Limited Company',
        registrationDate: '2020-01-15',
        status: 'Active',
        taxpayerType: 'Regular',
        lastUpdated: new Date().toISOString()
      };

      resolve(mockData);
    }, 1500); // Simulate API delay
  });
}

/**
 * Default store locations for ShelfIQ
 * In production, load from database/settings
 */
export const DEFAULT_STORES: StoreLocation[] = [
  {
    id: 'store-1',
    name: 'ShelfIQ Mumbai HQ',
    address: '123 MG Road, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400069',
    phone: '+91 22 1234 5678',
    email: 'mumbai@shelfiq.com',
    gstin: '27AAAAA0000A1Z5',
    isHeadquarters: true
  },
  {
    id: 'store-2',
    name: 'ShelfIQ Delhi Branch',
    address: '456 Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    stateCode: '07',
    pincode: '110001',
    phone: '+91 11 9876 5432',
    email: 'delhi@shelfiq.com',
    gstin: '07AAAAA0000A1Z5'
  },
  {
    id: 'store-3',
    name: 'ShelfIQ Bangalore Branch',
    address: '789 MG Road, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '560034',
    phone: '+91 80 5555 1234',
    email: 'bangalore@shelfiq.com',
    gstin: '29AAAAA0000A1Z5'
  },
  {
    id: 'store-4',
    name: 'ShelfIQ Pune Branch',
    address: '321 FC Road, Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '411004',
    phone: '+91 20 7777 8888',
    email: 'pune@shelfiq.com',
    gstin: '27BBBBB1111B1Z6'
  },
  {
    id: 'store-5',
    name: 'ShelfIQ Hyderabad Branch',
    address: '654 Banjara Hills Road',
    city: 'Hyderabad',
    state: 'Telangana',
    stateCode: '36',
    pincode: '500034',
    phone: '+91 40 3333 4444',
    email: 'hyderabad@shelfiq.com',
    gstin: '36AAAAA0000A1Z5'
  }
];

/**
 * Determine transaction type based on store and customer state
 */
export function getTransactionType(storeStateCode: string, customerStateCode: string): {
  type: 'INTRA_STATE' | 'INTER_STATE';
  description: string;
  taxApplicable: 'CGST + SGST' | 'IGST';
} {
  const isSame = storeStateCode === customerStateCode;
  
  return {
    type: isSame ? 'INTRA_STATE' : 'INTER_STATE',
    description: isSame 
      ? 'Same State Transaction (Within State)' 
      : 'Inter-State Transaction (Between Different States)',
    taxApplicable: isSame ? 'CGST + SGST' : 'IGST'
  };
}

/**
 * Format store location for invoice display
 */
export function formatStoreAddress(store: StoreLocation): string {
  return `${store.address}, ${store.city}, ${store.state} - ${store.pincode}`;
}

/**
 * Get store by state code
 */
export function getStoreByState(stateCode: string, stores: StoreLocation[] = DEFAULT_STORES): StoreLocation | null {
  return stores.find(s => s.stateCode === stateCode) || null;
}

/**
 * Search stores by name or city
 */
export function searchStores(query: string, stores: StoreLocation[] = DEFAULT_STORES): StoreLocation[] {
  const lowerQuery = query.toLowerCase();
  return stores.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.city.toLowerCase().includes(lowerQuery) ||
    s.state.toLowerCase().includes(lowerQuery)
  );
}
import { User, Product, Sale } from '../types';

export const STORES = ['Store A', 'Store B', 'Store C', 'All Stores'];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@retail.com',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: '2',
    name: 'Store A Manager',
    email: 'manager@retail.com',
    role: 'manager',
    password: 'manager123',
    storeLocation: 'Store A'
  },
  {
    id: '3',
    name: 'Data Analyst',
    email: 'analyst@retail.com',
    role: 'analyst',
    password: 'analyst123'
  },
  {
    id: '4',
    name: 'Store B Manager',
    email: 'managerb@retail.com',
    role: 'manager',
    password: 'manager123',
    storeLocation: 'Store B'
  },
  {
    id: '5',
    name: 'Store C Manager',
    email: 'managerc@retail.com',
    role: 'manager',
    password: 'manager123',
    storeLocation: 'Store C'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Rice 1kg',
    category: 'Groceries',
    costPrice: 40,
    sellingPrice: 60,
    currentStock: 500,
    reorderLevel: 100,
    lastRestocked: new Date('2024-12-10')
  },
  {
    id: 'P002',
    name: 'Wheat Flour 1kg',
    category: 'Groceries',
    costPrice: 35,
    sellingPrice: 50,
    currentStock: 300,
    reorderLevel: 80,
    lastRestocked: new Date('2024-12-12')
  },
  {
    id: 'P003',
    name: 'Cooking Oil 1L',
    category: 'Groceries',
    costPrice: 120,
    sellingPrice: 150,
    currentStock: 200,
    reorderLevel: 50,
    lastRestocked: new Date('2024-12-14')
  },
  {
    id: 'P004',
    name: 'Sugar 1kg',
    category: 'Groceries',
    costPrice: 38,
    sellingPrice: 55,
    currentStock: 400,
    reorderLevel: 100,
    lastRestocked: new Date('2024-12-11')
  },
  {
    id: 'P005',
    name: 'Tea Powder 250g',
    category: 'Beverages',
    costPrice: 80,
    sellingPrice: 120,
    currentStock: 150,
    reorderLevel: 40,
    lastRestocked: new Date('2024-12-13')
  },
  {
    id: 'P006',
    name: 'Coffee 200g',
    category: 'Beverages',
    costPrice: 200,
    sellingPrice: 280,
    currentStock: 80,
    reorderLevel: 30,
    lastRestocked: new Date('2024-12-15')
  },
  {
    id: 'P007',
    name: 'Milk 1L',
    category: 'Dairy',
    costPrice: 45,
    sellingPrice: 60,
    currentStock: 100,
    reorderLevel: 50,
    lastRestocked: new Date('2024-12-16')
  },
  {
    id: 'P008',
    name: 'Butter 500g',
    category: 'Dairy',
    costPrice: 220,
    sellingPrice: 300,
    currentStock: 60,
    reorderLevel: 20,
    lastRestocked: new Date('2024-12-14')
  },
  {
    id: 'P009',
    name: 'Bread',
    category: 'Bakery',
    costPrice: 25,
    sellingPrice: 40,
    currentStock: 50,
    reorderLevel: 30,
    lastRestocked: new Date('2024-12-16')
  },
  {
    id: 'P010',
    name: 'Biscuits Pack',
    category: 'Snacks',
    costPrice: 30,
    sellingPrice: 50,
    currentStock: 200,
    reorderLevel: 50,
    lastRestocked: new Date('2024-12-12')
  },
  {
    id: 'P011',
    name: 'Chips 100g',
    category: 'Snacks',
    costPrice: 15,
    sellingPrice: 20,
    currentStock: 250,
    reorderLevel: 60,
    lastRestocked: new Date('2024-12-13')
  },
  {
    id: 'P012',
    name: 'Soft Drink 2L',
    category: 'Beverages',
    costPrice: 60,
    sellingPrice: 90,
    currentStock: 120,
    reorderLevel: 40,
    lastRestocked: new Date('2024-12-15')
  },
  {
    id: 'P013',
    name: 'Detergent 1kg',
    category: 'Household',
    costPrice: 100,
    sellingPrice: 140,
    currentStock: 25,
    reorderLevel: 30,
    lastRestocked: new Date('2024-11-20')
  },
  {
    id: 'P014',
    name: 'Soap Bar',
    category: 'Personal Care',
    costPrice: 20,
    sellingPrice: 35,
    currentStock: 180,
    reorderLevel: 50,
    lastRestocked: new Date('2024-12-14')
  },
  {
    id: 'P015',
    name: 'Shampoo 200ml',
    category: 'Personal Care',
    costPrice: 80,
    sellingPrice: 120,
    currentStock: 90,
    reorderLevel: 25,
    lastRestocked: new Date('2024-12-13')
  }
];

// Generate mock sales data for the last 30 days
export const generateMockSales = (): Sale[] => {
  const sales: Sale[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate 5-15 random sales per day
    const salesPerDay = Math.floor(Math.random() * 10) + 5;
    
    for (let j = 0; j < salesPerDay; j++) {
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0;
      const totalAmount = (product.sellingPrice * quantity) * (1 - discount / 100);
      
      sales.push({
        id: `S${Date.now()}-${i}-${j}`,
        productId: product.id,
        productName: product.name,
        quantity,
        saleDate: date,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        discount,
        totalAmount,
        storeLocation: ['Store A', 'Store B', 'Store C'][Math.floor(Math.random() * 3)]
      });
    }
  }
  
  return sales.sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime());
};

export const mockSales = generateMockSales();
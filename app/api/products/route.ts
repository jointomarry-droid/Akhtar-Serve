import { NextRequest, NextResponse } from 'next/server';

const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    sku: 'WBE-001',
    price: 29.99,
    cost: 12.50,
    stock: 150,
    marketplace: 'amazon',
    status: 'active',
    image: '/products/earbuds.jpg',
    description: 'High-quality wireless earbuds with noise cancellation',
    category: 'Electronics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'USB-C Hub Adapter',
    sku: 'UCH-002',
    price: 45.99,
    cost: 18.00,
    stock: 85,
    marketplace: 'ebay',
    status: 'active',
    image: '/products/hub.jpg',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
    category: 'Electronics',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Ergonomic Mouse Pad',
    sku: 'EMP-003',
    price: 15.99,
    cost: 4.50,
    stock: 320,
    marketplace: 'amazon',
    status: 'active',
    image: '/products/mousepad.jpg',
    description: 'Memory foam wrist rest mouse pad for comfortable computing',
    category: 'Accessories',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'LED Desk Lamp',
    sku: 'LDL-004',
    price: 34.99,
    cost: 14.00,
    stock: 75,
    marketplace: 'ebay',
    status: 'low_stock',
    image: '/products/lamp.jpg',
    description: 'Adjustable LED desk lamp with 5 brightness levels',
    category: 'Home Office',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Phone Stand Holder',
    sku: 'PSH-005',
    price: 12.99,
    cost: 3.50,
    stock: 500,
    marketplace: 'amazon',
    status: 'active',
    image: '/products/stand.jpg',
    description: 'Adjustable aluminum phone stand for desk',
    category: 'Accessories',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filtered = [...mockProducts];

    if (marketplace) {
      filtered = filtered.filter(p => p.marketplace === marketplace);
    }
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      products: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sku, price, cost, stock, marketplace, description, category } = body;

    if (!name || !sku || !price || !marketplace) {
      return NextResponse.json(
        { error: 'Missing required fields: name, sku, price, marketplace' },
        { status: 400 }
      );
    }

    const newProduct = {
      id: String(mockProducts.length + 1),
      name,
      sku,
      price: Number(price),
      cost: Number(cost || 0),
      stock: Number(stock || 0),
      marketplace,
      status: 'active',
      image: '/products/default.jpg',
      description: description || '',
      category: category || 'General',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'John Smith',
    email: 'john@example.com',
    items: [
      { productId: '1', name: 'Wireless Bluetooth Earbuds', quantity: 2, price: 29.99 },
    ],
    total: 59.98,
    status: 'shipped',
    marketplace: 'amazon',
    shippingAddress: '123 Main St, New York, NY 10001',
    trackingNumber: '1Z999AA10123456784',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    customerName: 'Sarah Johnson',
    email: 'sarah@example.com',
    items: [
      { productId: '2', name: 'USB-C Hub Adapter', quantity: 1, price: 45.99 },
      { productId: '3', name: 'Ergonomic Mouse Pad', quantity: 2, price: 15.99 },
    ],
    total: 77.97,
    status: 'processing',
    marketplace: 'ebay',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    trackingNumber: '',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Wilson',
    email: 'mike@example.com',
    items: [
      { productId: '4', name: 'LED Desk Lamp', quantity: 1, price: 34.99 },
    ],
    total: 34.99,
    status: 'delivered',
    marketplace: 'amazon',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    trackingNumber: '1Z999AA10123456785',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ORD-004',
    customerName: 'Emily Davis',
    email: 'emily@example.com',
    items: [
      { productId: '5', name: 'Phone Stand Holder', quantity: 3, price: 12.99 },
    ],
    total: 38.97,
    status: 'pending',
    marketplace: 'ebay',
    shippingAddress: '321 Elm St, Houston, TX 77001',
    trackingNumber: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const marketplace = searchParams.get('marketplace');

    let filtered = [...mockOrders];

    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    if (marketplace) {
      filtered = filtered.filter(o => o.marketplace === marketplace);
    }

    return NextResponse.json({
      orders: filtered,
      total: filtered.length,
      stats: {
        totalRevenue: filtered.reduce((sum, o) => sum + o.total, 0),
        pendingOrders: filtered.filter(o => o.status === 'pending').length,
        shippedOrders: filtered.filter(o => o.status === 'shipped').length,
        deliveredOrders: filtered.filter(o => o.status === 'delivered').length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

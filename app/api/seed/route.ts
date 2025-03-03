import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export async function GET(request: NextRequest) {
  try {
    await seedDatabase();
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
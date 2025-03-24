// Run this script to populate the database with initial data
// npm run seed

// ts-node -r tsconfig-paths/register scripts/seed.ts

import { seedDatabase } from '../scripts/seed-data';

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedDatabase();
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main(); 
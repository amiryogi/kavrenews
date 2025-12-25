import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Category from '../models/Category.js';

// Get the directory of current file and load .env from parent (server) folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const categories = [
  { name: { np: 'मुख्य समाचार', en: 'Main News' }, slug: 'main', order: 1 },
  { name: { np: 'राजनीति', en: 'Politics' }, slug: 'politics', order: 2 },
  { name: { np: 'समाज', en: 'Society' }, slug: 'society', order: 3 },
  { name: { np: 'अर्थ', en: 'Economy' }, slug: 'economy', order: 4 },
  { name: { np: 'खेलकुद', en: 'Sports' }, slug: 'sports', order: 5 },
  { name: { np: 'मनोरञ्जन', en: 'Entertainment' }, slug: 'entertainment', order: 6 },
  { name: { np: 'विचार', en: 'Opinion' }, slug: 'opinion', order: 7 },
  { name: { np: 'स्वास्थ्य', en: 'Health' }, slug: 'health', order: 8 },
  { name: { np: 'शिक्षा', en: 'Education' }, slug: 'education', order: 9 },
  { name: { np: 'प्रविधि', en: 'Technology' }, slug: 'technology', order: 10 },
  { name: { np: 'अन्तर्राष्ट्रिय', en: 'International' }, slug: 'international', order: 11 },
  { name: { np: 'काभ्रे विशेष', en: 'Kavre Special' }, slug: 'kavre-special', order: 12 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    console.log('Existing data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@kavrenews.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created:', admin.email);

    // Create categories
    await Category.insertMany(categories);
    console.log('Categories created');

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@kavrenews.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

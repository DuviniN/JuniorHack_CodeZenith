import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Shop from '../models/Shop.js';

dotenv.config();

const shops = [
  {
    name: 'Good Market',
    city: 'Colombo',
    websiteUrl: 'https://www.goodmarket.global/info/srilanka/',
    mapUrl: 'https://maps.app.goo.gl/qXtJGe8k4V6oA2jD9',
    specialties: ['organic produce', 'marketplace events', 'organic PGS', 'healthy groceries'],
    description: 'A community marketplace featuring organic produce and healthy groceries from local farmers and producers.',
    phone: '',
    email: ''
  },
  {
    name: 'Haritha Foods',
    city: 'Colombo',
    websiteUrl: 'https://harithafoods.in/',
    mapUrl: 'https://maps.app.goo.gl/q4EoH1o9kG7fi1Gq6',
    specialties: ['millet staples', 'ready to cook', 'healthy spice mixes', 'millet flours'],
    description: 'Specializes in millet-based products and healthy ready-to-cook meals.',
    phone: '',
    email: ''
  },
  {
    name: 'Saviru Spices Naturals',
    city: 'Matale',
    websiteUrl: 'https://bizconnect.idb.gov.lk/listing/matale/food-and-beverages,spice-related-industries/saviru-spices-naturals-pvt-ltd/',
    mapUrl: 'https://maps.app.goo.gl/c2KmZVbNUsngmKzF9',
    specialties: ['spices & condiments', 'dehydrated foods', 'processed foods', 'herbal products'],
    description: 'Traditional spice merchant offering authentic Sri Lankan spices and herbal products.',
    phone: '',
    email: ''
  }
];

const seedShops = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing shops
    await Shop.deleteMany({});
    console.log('Cleared existing shops');

    // Insert shops
    const insertedShops = await Shop.insertMany(shops);
    console.log(`Seeded ${insertedShops.length} shops`);

    // Display inserted shops
    insertedShops.forEach((shop) => {
      console.log(`- ${shop.name} (${shop.city})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding shops:', error);
    process.exit(1);
  }
};

seedShops();


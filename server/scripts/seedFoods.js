import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Food from '../models/Food.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const seed = async () => {
  try {
    await connectDB();
    const filePath = path.resolve(__dirname, '..', 'data', 'seedFoods.json');
    const foods = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    await Food.deleteMany({});
    // Set all seeded foods to 'pending' status so admins can approve them
    const foodsWithPendingStatus = foods.map(food => ({ ...food, status: 'pending' }));
    await Food.insertMany(foodsWithPendingStatus);
    console.log(`Inserted ${foods.length} foods with pending status`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seed();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in .env file');
    throw new Error('MongoDB connection string is missing. Please set MONGO_URI in your .env file');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Increased timeout to 10 seconds
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n📋 Common solutions:');
      console.error('1. Check if your IP address is whitelisted in MongoDB Atlas:');
      console.error('   https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('2. Verify your MONGO_URI in the .env file is correct');
      console.error('3. Check if your MongoDB Atlas cluster is running');
      console.error('4. For local development, you can use: mongodb://127.0.0.1:27017/nutrition-advisor');
      console.error('\n💡 To whitelist your IP:');
      console.error('   - Go to MongoDB Atlas → Network Access');
      console.error('   - Click "Add IP Address"');
      console.error('   - Click "Add Current IP Address" or use 0.0.0.0/0 (less secure, for development only)');
    } else {
      console.error('Error details:', error.message);
    }
    
    throw error;
  }
};

export default connectDB;


import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URI;

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000
  });

  console.log('MongoDB connected');
};

export default connectDB;


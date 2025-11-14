import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    mapUrl: String,
    specialties: [String],
    description: String,
    phone: String,
    email: String
  },
  { timestamps: true }
);

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;


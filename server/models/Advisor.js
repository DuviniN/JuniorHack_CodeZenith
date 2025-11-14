import mongoose from 'mongoose';

const advisorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: String,
    image: String,
    experienceYears: Number,
    city: String,
    languages: [String],
    bio: String,
    contactEmail: String,
    virtual: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8 },
    calendarUrl: String,
    feeLkr: Number
  },
  { timestamps: true }
);

const Advisor = mongoose.model('Advisor', advisorSchema);

export default Advisor;


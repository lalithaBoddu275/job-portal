import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Listen for successful connection
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    // Connect using the MONGODB_URI from .env
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Stop the app if DB fails
  }
};

export default connectDB;


import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));

    await mongoose.connect(`${process.env.MONGODB_URI}job-portal`, {
      dbName: 'job-portal', // explicitly set db name
    });
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1); // stop the app if DB fails
  }
};

export default connectDB;

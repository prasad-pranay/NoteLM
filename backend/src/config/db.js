import mongoose from 'mongoose';

/**
 * Connect to MongoDB with retry logic.
 * Exits the process after 5 failed attempts.
 */
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongoose 8 uses these by default, but explicit for clarity
        autoIndex: true,
      });
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed:`, error.message);
      if (retries === MAX_RETRIES) {
        console.error('💀 Could not connect to MongoDB. Exiting...');
        process.exit(1);
      }
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 2000 * retries));
    }
  }
};

export default connectDB;

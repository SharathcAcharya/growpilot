import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/growpilot';
    
    await mongoose.connect(mongoURI, {
      // Modern Mongoose doesn't need these options anymore
      // but keeping them for compatibility if using older versions
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error: any) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error: any) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

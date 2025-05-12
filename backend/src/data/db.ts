import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Track connection status
let isConnected = false;

export const connectToDatabase = async (): Promise<void> => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  // Connection options optimized for serverless
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    connectTimeoutMS: 10000, // Give up initial connection after 10s
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 1, // Keep at least 1 socket connection
    autoIndex: false, // Don't build indexes
    maxIdleTimeMS: 10000, // Close idle connections after 10s
    family: 4 // Use IPv4, skip trying IPv6
  };

  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB is already connected');
      isConnected = true;
      return;
    }

    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    // Don't throw the error, allows the API to work without DB
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  // In serverless, maintain connection for future invocations
  if (process.env.VERCEL) {
    console.log('Keeping connection alive for serverless environment');
    return;
  }

  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error);
  }
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

// Only attach SIGINT handler in non-serverless environments
if (!process.env.VERCEL) {
  process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
  });
} 
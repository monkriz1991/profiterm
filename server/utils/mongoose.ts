import mongoose from "mongoose";

// Connection state tracking
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

// Optimized connection options
const MONGODB_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
};

/**
 * Ensures a single MongoDB connection is maintained across the application.
 * Uses connection pooling and handles reconnection gracefully.
 */
export async function ensureConnection(): Promise<typeof mongoose> {
  // Return existing connection if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Return pending connection promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  const config = useRuntimeConfig();
  const uri = config.mongodbUri || config.bdurl;

  if (!uri) {
    throw new Error(
      "MongoDB URI is not configured. Please set DATABASE_URL in environment variables.",
    );
  }

  // Create new connection promise
  connectionPromise = mongoose
    .connect(uri, MONGODB_OPTIONS)
    .then((mongooseInstance) => {
      isConnected = true;
      console.log("[MongoDB] Connected successfully");
      return mongooseInstance;
    })
    .catch((error) => {
      connectionPromise = null;
      isConnected = false;
      console.error("[MongoDB] Connection error:", error.message);
      throw error;
    });

  // Set up event listeners for connection monitoring
  mongoose.connection.on("disconnected", () => {
    console.log("[MongoDB] Disconnected");
    isConnected = false;
    connectionPromise = null;
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
    isConnected = false;
    connectionPromise = null;
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected");
    isConnected = true;
  });

  return connectionPromise;
}

/**
 * Returns the connection status
 */
export function getConnectionStatus(): {
  isConnected: boolean;
  readyState: number;
} {
  return {
    isConnected,
    readyState: mongoose.connection.readyState,
  };
}

/**
 * Gracefully closes the MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    isConnected = false;
    connectionPromise = null;
    console.log("[MongoDB] Connection closed");
  }
}

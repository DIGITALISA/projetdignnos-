import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

async function connectDB() {
    // Return existing connection immediately
    if (cached.conn && cached.conn.connection.readyState === 1) {
        return cached.conn;
    }

    // If connection is in progress, wait for it
    if (cached.promise) {
        try {
            cached.conn = await cached.promise;
            return cached.conn;
        } catch {
            // If promise failed, reset and try again
            cached.promise = null;
        }
    }

    const opts = {
        bufferCommands: false,
        // Aggressive timeout settings to fail fast
        serverSelectionTimeoutMS: 5000, // 5 seconds max to select a server
        socketTimeoutMS: 10000, // 10 seconds max for socket operations
        connectTimeoutMS: 5000, // 5 seconds max to establish connection
        // Connection pool settings
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000, // Close idle connections after 30s
    };

    console.log('🔄 Attempting MongoDB connection...');
    const startTime = Date.now();

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
        .then((mongoose) => {
            const duration = Date.now() - startTime;
            console.log(`✅ MongoDB connected successfully in ${duration}ms`);
            return mongoose;
        })
        .catch((error) => {
            const duration = Date.now() - startTime;
            console.error(`❌ MongoDB connection failed after ${duration}ms:`, error.message);
            cached.promise = null;
            throw new Error(`MongoDB connection timeout or failed: ${error.message}`);
        });

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        cached.conn = null;
        throw e;
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📴 Mongoose disconnected from MongoDB');
    cached.conn = null;
    cached.promise = null;
});

export const connectToDatabase = connectDB;
export default connectDB;

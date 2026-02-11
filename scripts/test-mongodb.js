// MongoDB Connection Test Script
const mongoose = require('mongoose');

// Hardcode the URI for testing (will be replaced with env var in production)
const MONGODB_URI = "mongodb+srv://digitallearningconsulting89_db_user:GvA9xUErjkm2URNJ@cluster0.decahd4.mongodb.net/career_upgrade?retryWrites=true&w=majority&appName=Cluster0";

console.log('🔍 MongoDB Connection Diagnostic Tool\n');
console.log('='.repeat(60));

// Mask password for security
const maskedURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log('📋 Connection String (masked):', maskedURI);
console.log('='.repeat(60));

// Parse URI to show details
try {
    const url = new URL(MONGODB_URI.replace('mongodb+srv://', 'https://'));
    console.log('\n📊 Connection Details:');
    console.log('  - Protocol: mongodb+srv://');
    console.log('  - Username:', url.username);
    console.log('  - Password:', '****' + url.password.slice(-4));
    console.log('  - Host:', url.hostname);
    console.log('  - Database:', url.pathname.split('?')[0].substring(1));
    console.log('='.repeat(60));
} catch (e) {
    console.error('⚠️  Could not parse URI:', e.message);
}

// Test connection with aggressive timeouts
const opts = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 10000,
    maxPoolSize: 5,
};

console.log('\n🔄 Attempting connection...\n');
const startTime = Date.now();

mongoose.connect(MONGODB_URI, opts)
    .then(() => {
        const duration = Date.now() - startTime;
        console.log('✅ SUCCESS! MongoDB connected in', duration, 'ms');
        console.log('='.repeat(60));
        console.log('\n📡 Connection State:', mongoose.connection.readyState);
        console.log('   0 = disconnected');
        console.log('   1 = connected');
        console.log('   2 = connecting');
        console.log('   3 = disconnecting');
        console.log('\n🎉 Your MongoDB connection is working perfectly!');
        console.log('='.repeat(60));
        mongoose.connection.close();
        process.exit(0);
    })
    .catch((error) => {
        const duration = Date.now() - startTime;
        console.error('\n❌ FAILED after', duration, 'ms');
        console.log('='.repeat(60));
        console.error('\n🔴 Error Type:', error.name);
        console.error('🔴 Error Message:', error.message);
        
        if (error.message.includes('IP')) {
            console.log('\n💡 Solution: Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
            console.log('   Go to: https://cloud.mongodb.com → Network Access → Add IP Address');
        } else if (error.message.includes('authentication')) {
            console.log('\n💡 Solution: Check username/password in Database Access');
            console.log('   Go to: https://cloud.mongodb.com → Database Access');
        } else if (error.message.includes('timeout')) {
            console.log('\n💡 Solution: Check your internet connection or MongoDB Atlas status');
        }
        
        console.log('='.repeat(60));
        process.exit(1);
    });

// Timeout safety
setTimeout(() => {
    console.error('\n⏱️  Connection attempt timed out after 15 seconds');
    console.error('This usually means:');
    console.error('  1. Your IP is not whitelisted in MongoDB Atlas');
    console.error('  2. MongoDB Atlas cluster is paused');
    console.error('  3. Network/firewall is blocking the connection');
    process.exit(1);
}, 15000);

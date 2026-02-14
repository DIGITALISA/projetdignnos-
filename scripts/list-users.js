const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
let MONGODB_URI = '';

for (const line of envLines) {
    if (line.trim().startsWith('MONGODB_URI=')) {
        // Get everything after the = sign, including quotes if present
        const value = line.substring(line.indexOf('=') + 1).trim();
        // Remove quotes if present
        MONGODB_URI = value.replace(/^["']|["']$/g, '');
        break;
    }
}

if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role: String,
    status: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function listUsers() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const users = await User.find({}).select('email fullName role status').limit(20);
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log('📋 Available users:\n');
        users.forEach((u, idx) => {
            console.log(`${idx + 1}. ${u.email}`);
            console.log(`   Name: ${u.fullName}`);
            console.log(`   Role: ${u.role}`);
            console.log(`   Status: ${u.status}\n`);
        });
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

listUsers();

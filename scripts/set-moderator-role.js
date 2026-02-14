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
        const value = line.substring(line.indexOf('=') + 1).trim();
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

async function setModeratorRole(email) {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User not found with email: ${email}\n`);
            console.log('Available users:');
            const users = await User.find({}).select('email fullName role').limit(10);
            users.forEach(u => {
                console.log(`  - ${u.email} (${u.fullName}) - Role: ${u.role}`);
            });
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`Found user: ${user.fullName} (${user.email})`);
        console.log(`Current role: ${user.role}`);
        
        user.role = 'Moderator';
        await user.save();
        
        console.log(`\n✅ Role updated to: Moderator`);
        console.log('\n🔗 You can now access: http://localhost:3000/moderateur');
        console.log(`   Login with: ${email}\n`);
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
    console.log('❌ Usage: node set-moderator-role.js <email>');
    console.log('Example: node set-moderator-role.js user@example.com\n');
    process.exit(1);
}

setModeratorRole(email);

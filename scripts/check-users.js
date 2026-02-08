const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://digitallearningconsulting89_db_user:GvA9xUErjkm2URNJ@cluster0.decahd4.mongodb.net/career_upgrade?retryWrites=true&w=majority&appName=Cluster0";

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    role: String,
    status: String,
    plan: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkUsers() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        console.log("👥 Fetching all users...\n");
        const users = await User.find({}).select('fullName email role status plan createdAt');
        
        console.log(`📊 Total Users: ${users.length}\n`);
        console.log("=" .repeat(100));
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.fullName || 'No Name'}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Role: ${user.role}`);
            console.log(`   📋 Plan: ${user.plan || 'None'}`);
            console.log(`   ⚡ Status: ${user.status}`);
            console.log(`   📅 Created: ${user.createdAt?.toLocaleDateString() || 'Unknown'}`);
        });
        
        console.log("\n" + "=".repeat(100));
        console.log("\n📈 Summary:");
        console.log(`   Total Users: ${users.length}`);
        console.log(`   Active: ${users.filter(u => u.status === 'Active').length}`);
        console.log(`   Pending: ${users.filter(u => u.status === 'Pending').length}`);
        console.log(`   Admins: ${users.filter(u => u.role === 'Admin').length}`);
        
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Connection closed");
    }
}

checkUsers();

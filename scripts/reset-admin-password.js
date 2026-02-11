const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://digitallearningconsulting89_db_user:GvA9xUErjkm2URNJ@cluster0.decahd4.mongodb.net/career_upgrade?retryWrites=true&w=majority&appName=Cluster0";

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    rawPassword: String,
    role: String,
    status: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetAdminPassword() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        // Find admin user
        const admin = await User.findOne({ email: "ahmed@gmail.com", role: "Admin" });
        
        if (!admin) {
            console.log("❌ Admin user not found!");
            return;
        }

        console.log(`👤 Found Admin: ${admin.fullName} (${admin.email})\n`);

        // New password
        const newPassword = "admin123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        admin.password = hashedPassword;
        admin.rawPassword = newPassword; // Store plain text for admin reference
        await admin.save();

        console.log("✅ Password reset successfully!\n");
        console.log("═".repeat(60));
        console.log("📧 Email: ahmed@gmail.com");
        console.log("🔑 New Password: admin123");
        console.log("═".repeat(60));
        console.log("\n✨ You can now login with these credentials!");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Connection closed");
    }
}

resetAdminPassword();

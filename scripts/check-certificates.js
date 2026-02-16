/**
 * 🔍 Script to check all existing certificate IDs in the database
 * سكريبت للتحقق من جميع معرفات الشهادات الموجودة
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkCertificates() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // استيراد الموديل
        const Certificate = require('../models/Certificate.js').default || require('../models/Certificate.js');

        // جلب جميع الشهادات
        const certificates = await Certificate.find({}).lean();
        
        console.log(`📊 Total Certificates: ${certificates.length}\n`);
        console.log('=' .repeat(80));
        
        if (certificates.length === 0) {
            console.log('⚠️  No certificates found in database');
        } else {
            certificates.forEach((cert, index) => {
                console.log(`\n${index + 1}. Certificate:`);
                console.log(`   ID (MongoDB): ${cert._id}`);
                console.log(`   Certificate ID: ${cert.certificateId || 'NOT SET'}`);
                console.log(`   User: ${cert.userName}`);
                console.log(`   Course: ${cert.courseTitle}`);
                console.log(`   Issue Date: ${cert.issueDate || cert.createdAt}`);
                console.log('-'.repeat(80));
            });
        }

        console.log('\n' + '='.repeat(80));
        console.log('📋 Summary:');
        console.log(`   Total: ${certificates.length}`);
        console.log(`   With certificateId: ${certificates.filter(c => c.certificateId).length}`);
        console.log(`   Without certificateId: ${certificates.filter(c => !c.certificateId).length}`);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

checkCertificates();

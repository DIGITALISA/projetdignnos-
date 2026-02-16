/**
 * 🔄 Migration Script: Add Reference IDs to Existing Records
 * سكريبت لإضافة معرفات للسجلات القديمة
 * 
 * Usage: node scripts/add-reference-ids.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import Recommendation from '../models/Recommendation.js';
import PerformanceProfile from '../models/PerformanceProfile.js';
import JobAlignment from '../models/JobAlignment.js';
import Diagnosis from '../models/Diagnosis.js';
import Simulation from '../models/Simulation.js';

// Import reference ID generator
import { generateReferenceId, DocumentType } from '../lib/referenceId.js';

/**
 * الاتصال بقاعدة البيانات
 */
async function connectDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

/**
 * إضافة معرفات للمستخدمين
 */
async function addMemberIds() {
    console.log('\n📋 Processing Users (Member IDs)...');
    
    const users = await User.find({
        $or: [
            { memberId: { $exists: false } },
            { memberId: null },
            { memberId: '' }
        ]
    });

    console.log(`Found ${users.length} users without Member IDs`);

    let updated = 0;
    for (const user of users) {
        try {
            const memberId = generateReferenceId(DocumentType.MEMBER);
            await User.updateOne(
                { _id: user._id },
                { $set: { memberId } }
            );
            console.log(`  ✓ ${user.email}: ${memberId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating ${user.email}:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${users.length} users`);
    return { total: users.length, updated };
}

/**
 * إضافة معرفات للشهادات
 */
async function addCertificateIds() {
    console.log('\n📋 Processing Certificates...');
    
    const certs = await Certificate.find({
        $or: [
            { certificateId: { $exists: false } },
            { certificateId: null },
            { certificateId: '' }
        ]
    });

    console.log(`Found ${certs.length} certificates without IDs`);

    let updated = 0;
    for (const cert of certs) {
        try {
            const certificateId = generateReferenceId(DocumentType.CERTIFICATE);
            await Certificate.updateOne(
                { _id: cert._id },
                { $set: { certificateId } }
            );
            console.log(`  ✓ ${cert.userName}: ${certificateId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating certificate:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${certs.length} certificates`);
    return { total: certs.length, updated };
}

/**
 * إضافة معرفات للتوصيات
 */
async function addRecommendationIds() {
    console.log('\n📋 Processing Recommendations...');
    
    const recs = await Recommendation.find({
        $or: [
            { referenceId: { $exists: false } },
            { referenceId: null },
            { referenceId: '' }
        ]
    });

    console.log(`Found ${recs.length} recommendations without Reference IDs`);

    let updated = 0;
    for (const rec of recs) {
        try {
            const referenceId = generateReferenceId(DocumentType.RECOMMENDATION);
            await Recommendation.updateOne(
                { _id: rec._id },
                { $set: { referenceId } }
            );
            console.log(`  ✓ ${rec.userName}: ${referenceId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating recommendation:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${recs.length} recommendations`);
    return { total: recs.length, updated };
}

/**
 * إضافة معرفات لملفات الأداء
 */
async function addPerformanceProfileIds() {
    console.log('\n📋 Processing Performance Profiles...');
    
    const profiles = await PerformanceProfile.find({
        $or: [
            { referenceId: { $exists: false } },
            { referenceId: null },
            { referenceId: '' }
        ]
    });

    console.log(`Found ${profiles.length} performance profiles without Reference IDs`);

    let updated = 0;
    for (const profile of profiles) {
        try {
            const referenceId = generateReferenceId(DocumentType.PERFORMANCE);
            await PerformanceProfile.updateOne(
                { _id: profile._id },
                { $set: { referenceId } }
            );
            console.log(`  ✓ ${profile.userName}: ${referenceId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating performance profile:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${profiles.length} performance profiles`);
    return { total: profiles.length, updated };
}

/**
 * إضافة معرفات لمواءمات الوظائف
 */
async function addJobAlignmentIds() {
    console.log('\n📋 Processing Job Alignments...');
    
    const alignments = await JobAlignment.find({
        $or: [
            { referenceId: { $exists: false } },
            { referenceId: null },
            { referenceId: '' }
        ]
    });

    console.log(`Found ${alignments.length} job alignments without Reference IDs`);

    let updated = 0;
    for (const alignment of alignments) {
        try {
            const referenceId = generateReferenceId(DocumentType.ALIGNMENT);
            await JobAlignment.updateOne(
                { _id: alignment._id },
                { $set: { referenceId } }
            );
            console.log(`  ✓ ${alignment.userName}: ${referenceId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating job alignment:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${alignments.length} job alignments`);
    return { total: alignments.length, updated };
}

/**
 * إضافة معرفات للتشخيصات
 */
async function addDiagnosisIds() {
    console.log('\n📋 Processing Diagnoses (SCI)...');
    
    const diagnoses = await Diagnosis.find({
        $or: [
            { referenceId: { $exists: false } },
            { referenceId: null },
            { referenceId: '' }
        ]
    });

    console.log(`Found ${diagnoses.length} diagnoses without Reference IDs`);

    let updated = 0;
    for (const diagnosis of diagnoses) {
        try {
            const referenceId = generateReferenceId(DocumentType.DIAGNOSIS);
            await Diagnosis.updateOne(
                { _id: diagnosis._id },
                { $set: { referenceId } }
            );
            console.log(`  ✓ ${diagnosis.userName}: ${referenceId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating diagnosis:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${diagnoses.length} diagnoses`);
    return { total: diagnoses.length, updated };
}

/**
 * إضافة معرفات للمحاكاات
 */
async function addSimulationIds() {
    console.log('\n📋 Processing Simulations...');
    
    const simulations = await Simulation.find({
        $or: [
            { referenceId: { $exists: false } },
            { referenceId: null },
            { referenceId: '' }
        ]
    });

    console.log(`Found ${simulations.length} simulations without Reference IDs`);

    let updated = 0;
    for (const simulation of simulations) {
        try {
            const referenceId = generateReferenceId(DocumentType.SIMULATION);
            await Simulation.updateOne(
                { _id: simulation._id },
                { $set: { referenceId } }
            );
            console.log(`  ✓ ${simulation.title}: ${referenceId}`);
            updated++;
        } catch (error) {
            console.error(`  ✗ Error updating simulation:`, error.message);
        }
    }

    console.log(`✅ Updated ${updated}/${simulations.length} simulations`);
    return { total: simulations.length, updated };
}

/**
 * تشغيل جميع عمليات الترحيل
 */
async function runMigration() {
    console.log('🚀 Starting Reference ID Migration...\n');
    console.log('=' .repeat(60));

    const results = {
        users: { total: 0, updated: 0 },
        certificates: { total: 0, updated: 0 },
        recommendations: { total: 0, updated: 0 },
        performanceProfiles: { total: 0, updated: 0 },
        jobAlignments: { total: 0, updated: 0 },
        diagnoses: { total: 0, updated: 0 },
        simulations: { total: 0, updated: 0 },
    };

    try {
        results.users = await addMemberIds();
        results.certificates = await addCertificateIds();
        results.recommendations = await addRecommendationIds();
        results.performanceProfiles = await addPerformanceProfileIds();
        results.jobAlignments = await addJobAlignmentIds();
        results.diagnoses = await addDiagnosisIds();
        results.simulations = await addSimulationIds();

        console.log('\n' + '=' .repeat(60));
        console.log('📊 Migration Summary:');
        console.log('=' .repeat(60));
        
        const totalRecords = Object.values(results).reduce((sum, r) => sum + r.total, 0);
        const totalUpdated = Object.values(results).reduce((sum, r) => sum + r.updated, 0);

        console.log(`\n  Users:              ${results.users.updated}/${results.users.total}`);
        console.log(`  Certificates:       ${results.certificates.updated}/${results.certificates.total}`);
        console.log(`  Recommendations:    ${results.recommendations.updated}/${results.recommendations.total}`);
        console.log(`  Performance:        ${results.performanceProfiles.updated}/${results.performanceProfiles.total}`);
        console.log(`  Job Alignments:     ${results.jobAlignments.updated}/${results.jobAlignments.total}`);
        console.log(`  Diagnoses:          ${results.diagnoses.updated}/${results.diagnoses.total}`);
        console.log(`  Simulations:        ${results.simulations.updated}/${results.simulations.total}`);
        
        console.log('\n' + '-'.repeat(60));
        console.log(`  TOTAL:              ${totalUpdated}/${totalRecords}`);
        console.log('=' .repeat(60));
        
        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        throw error;
    }
}

/**
 * نقطة الدخول الرئيسية
 */
async function main() {
    try {
        await connectDB();
        await runMigration();
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

// تشغيل السكريبت
main();

import mongoose from 'mongoose';
import Diagnosis from './models/Diagnosis';
import connectDB from './lib/mongodb';

async function findLevel() {
    await connectDB();
    const diagnosis = await Diagnosis.findOne({ userName: /maaloul ahmed/i });
    if (diagnosis) {
        console.log('USER_LEVEL:', diagnosis.analysis.experience.quality);
        console.log('FULL_ANALYSIS:', JSON.stringify(diagnosis.analysis.experience));
    } else {
        console.log('Diagnosis not found');
    }
    process.exit(0);
}

findLevel();

const mongoose = require('mongoose');

async function deleteMockCourses() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('MONGODB_URI is not defined in .env.local');
            return;
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Course Model
        const courseSchema = new mongoose.Schema({
            title: String
        }, { strict: false });
        const Course = mongoose.models.Course || mongoose.model('Course', courseSchema, 'courses');

        // Session Model
        const sessionSchema = new mongoose.Schema({
            courseId: mongoose.Schema.Types.ObjectId
        }, { strict: false });
        const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema, 'sessions');

        // Find courses to delete
        const mockCourses = await Course.find({ 
            $or: [
                { title: /ggggt/i },
                { title: /test/i },
                { instructor: /tgtgt/i }
            ]
        });

        console.log(`Found ${mockCourses.length} mock courses to delete.`);

        for (const course of mockCourses) {
            console.log(`Deleting course: ${course.title} (${course._id})`);
            await Course.findByIdAndDelete(course._id);
            const deleteSessions = await Session.deleteMany({ courseId: course._id });
            console.log(`Deleted ${deleteSessions.deletedCount} associated sessions.`);
        }

        console.log('Finished cleanup.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

deleteMockCourses();

import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the course"],
    },
    instructor: {
        type: String,
        required: [true, "Please provide an instructor name"],
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["Published", "Draft"],
        default: "Published",
    },
    thumbnail: {
        type: String,
        default: "General",
    },
    enrolled: {
        type: Number,
        default: 0,
    },
    date: {
        type: String,
        default: "Upcoming",
    },
    location: {
        type: String,
        default: "Online",
    },
    price: {
        type: Number,
        default: 0,
    },
    maxParticipants: {
        type: Number,
        default: 10,
    },
    allowedUsers: {
        type: [String],
        default: [], // List of user emails who have access
    },
    isAccessOpen: {
        type: Boolean,
        default: false, // Master switch for workshop access
    },
}, {
    timestamps: true,
});

const Course = models.Course || model("Course", CourseSchema);

export default Course;

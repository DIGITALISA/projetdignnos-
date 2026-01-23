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
}, {
    timestamps: true,
});

const Course = models.Course || model("Course", CourseSchema);

export default Course;

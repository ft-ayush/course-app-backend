const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin:passkey@cluster0.ufkm8gc.mongodb.net/course-app");

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [Number]
});

const CourseSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    imageLink: String, 
    published: Boolean
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}
const express = require('express')
const app = express()
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:passkey@cluster0.ufkm8gc.mongodb.net/course-app")

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [Number]
})

const User = mongoose.model('User', UserSchema)

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const Admin = mongoose.model('Admin', AdminSchema)

const CourseSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    imageLink: String, 
    published: Boolean
})

const Course = mongoose.model('Course', CourseSchema)

app.use(express.json())

async function adminMiddleware(req,res, next){
    const username = req.headers.username
    const password = req.headers.password
    const authorised = await Admin.findOne({username, password})
    if(authorised)
        next()
    else
        res.status(403).json({
            msg: "Authorisation Failed!"    
        })
}

async function userMiddleware(req,res, next){
    const username = req.headers.username
    const password = req.headers.password
    const authorised = await User.findOne({username, password})
    if(authorised)
        next()
    else
        res.status(403).json({
            msg: "Authorisation Failed!"    
        })
}

app.post('/admin/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    await Admin.create({username, password})
    res.json({
        msg: "Admin added successfully!"
    })
})

app.post('/admin/courses', adminMiddleware, async (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const imageLink = req.body.imageLink
    const published = req.body.published
    await Course.create({id, title, description, price, imageLink, published})
    res.json({
        msg: "Course added successfully!"
    })
})

app.get('/admin/courses', adminMiddleware, async (req, res) => {
    const courses = await Course.find({})
    res.json({courses})
})

app.post('/user/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    await User.create({username, password})
    res.json({
        msg: "User added successfully!"
    })
})

app.get('/user/courses', async (req, res) => {
    const courses = await Course.find({published: true})
    res.json({courses})
})

app.post('/user/courses/:courseId', userMiddleware, async (req, res) => {
    const username = req.headers.username
    const courseId = parseInt(req.params.courseId)
    await User.updateOne({username},{
        "$push": {purchasedCourses: courseId}
    })
    res.json({
        msg: "Purchase Complete!"
    })
})

app.get('/users/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.headers.username
    const user = await User.findOne({username})
    const purchasedCourses = await Course.find({
        id: {"$in": user.purchasedCourses}
    })
    res.json({purchasedCourses})
})

app.listen(3000)
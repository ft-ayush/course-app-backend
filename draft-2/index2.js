// try-catch, zod, update published, repeat sigin check

const express = require('express')
const app = express()
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:passkey@cluster0.ufkm8gc.mongodb.net/course-app")
const jwt = require('jsonwebtoken')
const JWT_KEY = "some-secret-key"

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
    const token = req.headers.authorization
    const words = req.headers.authorization.split(" ")
    const jwtToken = words[1]
    try{
        const decoded = jwt.verify(jwtToken, JWT_KEY)
        if(decoded.type === "admin")
            next()
        else
            res.status(403).json({
                msg: "Authorization Failed!"
            })
    } catch(e){
        res.status(403).json({
            msg: "Authorization Failed!"    
        })
    }
}

async function userMiddleware(req,res, next){
    const token = req.headers.authorization
    const words = req.headers.authorization.split(" ")
    const jwtToken = words[1]
    try{
        const decoded = jwt.verify(jwtToken, JWT_KEY)
        if(decoded.type === "user"){
            req.headers.username = decoded.username;
            next()
        }
        else
            res.status(403).json({
                msg: "Authorization Failed!"    
            })
    } catch(e){
        res.status(403).json({
            msg: "Authorization Failed!"    
        })
    }
}

app.post('/admin/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    await Admin.create({username, password})
    const token = jwt.sign({username, type: "admin"}, JWT_KEY)
    res.json({token})
})

app.post('/admin/signin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await Admin.find({username})
    if(user){
        const token =  jwt.sign({username, type: "admin"}, JWT_KEY)
        res.json({token})
    } else {
        res.sendStatus(401).json({
            msg: "Incorrect credentials!"
        })
    }
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
    const token = jwt.sign({username, type: "user"}, JWT_KEY)
    res.json({token})
})

app.post('/user/signin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await Admin.find({username})
    if(user){
        const token =  jwt.sign({username, type: "admin"}, JWT_KEY)
        res.json({token})
    } else {
        res.sendStatus(401).json({
            msg: "Incorrect credentials!"
        })
    }
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

app.get('/user/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.headers.username
    const user = await User.findOne({username})
    const purchasedCourses = await Course.find({
        id: {"$in": user.purchasedCourses}
    })
    res.json({purchasedCourses})
})

app.listen(3000)
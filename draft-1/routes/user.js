const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");

router.post('/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    await User.create({username, password})
    res.json({
        msg: "User added successfully!"
    })
});

router.get('/courses', async (req, res) => {
    const courses = await Course.find({published: true})
    res.json({courses})
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const username = req.headers.username
    const courseId = parseInt(req.params.courseId)
    await User.updateOne({username},{
        "$push": {purchasedCourses: courseId}
    })
    res.json({
        msg: "Purchase Complete!"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.headers.username
    const user = await User.findOne({username})
    const purchasedCourses = await Course.find({
        id: {"$in": user.purchasedCourses}
    })
    res.json({purchasedCourses})
});

module.exports = router
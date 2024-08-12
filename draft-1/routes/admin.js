const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();

router.post('/signup', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    await Admin.create({username, password})
    res.json({
        msg: "Admin added successfully!"
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
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
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const courses = await Course.find({})
    res.json({courses})
});

module.exports = router;
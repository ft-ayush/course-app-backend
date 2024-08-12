async function userMiddleware(req, res, next) {
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

module.exports = userMiddleware;
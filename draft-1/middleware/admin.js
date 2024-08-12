async function adminMiddleware(req, res, next) {
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

module.exports = adminMiddleware;
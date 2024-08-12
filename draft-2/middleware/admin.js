function adminMiddleware(req, res, next) {
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

module.exports = adminMiddleware;
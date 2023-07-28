const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET


function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if(authHeader) {
        // jika ada header authorization yang dikirikan
        console.log(authHeader);
        const token = authHeader.split('')[1];

        jwt.verify(token, JWT_SECRET, (err, user)=> {
            if(err){
                return res.status(403).json({
                    message : "invalid token"
                });
            }
            req.user = user;
            next();

        })
    } else {
        return res.status(401).json({
            message : "invalid or expired Token !!!"
        });
    }
}

module.exports = {
    auth : auth
}
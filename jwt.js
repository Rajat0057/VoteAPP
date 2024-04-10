const jwt = require('jsonwebtoken');

const jwtAuthMiddleWare=(req,resp,next)=>{
    const auth = req.headers.authorization;
    if(!auth) return resp.status(401).json({error:'Token noto Founf'});
    const token = req.headers.authorization.split(' ')[1]
    if(!token)
    {
        return resp.status(401).json({error:'Unauthorized'});
    }
    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();

    }catch(err)
    {
        console.log("error",err);
        return resp.status(401).json({error:'Invaild Token'});

    }
}

const genrateToken =(userData)=>{

    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000})

}

module.exports={jwtAuthMiddleWare,genrateToken}
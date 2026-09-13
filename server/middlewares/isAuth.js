import jwt from "jsonwebtoken"

const isAuth = (req,res,next) => {
    try{
        console.log("Cookies:", req.cookies);
        let {token}=req.cookies;
        if(!token){
            return res.status(400).json({message:"user does not have a token"})
        }
        const verifytoken=jwt.verify(token,process.env.JWT_SECRET)
        if(!verifytoken){
            return res.status(400).json({message:"user does not have a valid token"})
        }
        req.userId=verifytoken.userId

        next()

    }
    catch(error){
        return res.status(500).json({message:`IsAuth error ${error}`})

    }
}

export default isAuth

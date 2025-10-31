import jwt from "jsonwebtoken";

// User authetication middleware
const authUser = async(req,res,next)=>{
try{

    const {token} = req.headers
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"})
    
    }
    const token_decode = jwt.verify(token,process.env.JWT_SECRET)
    req.userId=token_decode._id
    next()


} catch (error) { 
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;

// backend/middleware/authUser.js
// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     const token = req.headers?.token || req.headers?.authorization;
//     if (!token) {
//       req.userId = null;
//       return next();
//     }
//     const raw = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
//     const decoded = jwt.verify(raw, process.env.JWT_SECRET);
//     req.userId = decoded?._id || decoded?.id || null;
//     next();
//   } catch (err) {
//     // treat invalid token as guest
//     req.userId = null;
//     next();
//   }
// };

// export default authUser;

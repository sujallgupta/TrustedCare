import jwt from "jsonwebtoken";

// doctor authetication middleware
const authDoctor = async(req,res,next)=>{
try{

    const {dToken} = req.headers
    if(!dToken){
        return res.json({success:false,message:"Not Authorized Login Again"})
    
    }
    const token_decode = jwt.verify(dToken,process.env.JWT_SECRET)
    req.docId=token_decode._id
    next()


} catch (error) { 
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;

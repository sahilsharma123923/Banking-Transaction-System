const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const emailService=require('../services/email.service')


async function userRegister(req,res) {

    const{email,name,password}=req.body

    const isEmailExist=await userModel.findOne({
        email:email
    })

    if(isEmailExist){
        return res.status(422).json({
            message:"Email is already exist"
        })
    }

    const user=await userModel.create({
        email,name,password
    });

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        },
        token

    })

    await emailService.sendRegistrationEmail(user.email,user.name);

}
async function userLogin(req,res){
    const{email,password}=req.body

    const user=await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Email or password is Invalid"
        })
    }

    const isValidPassword= await user.comparePassword(password)

    if(!isValidPassword){
         return res.status(401).json({
            message:" Password is incorrect"
        })
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie("token",token)

    res.status(200).json({
        message:"User login successfully",
        user:{
            id:user._id,
            email:user.email,
            name:user.name
        }
    })
}

module.exports={userRegister,userLogin}
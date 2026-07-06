const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')


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
 
    })

}

module.exports={userRegister}
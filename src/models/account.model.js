const mongoose=require('mongoose')


const accountSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with a user"],
        index:true
    },
    status:{
        enum:["ACTIVE","FROZEN","CLOSED"],
        message:"Status can be either ACTIVE , FROZEN or CLOSED"
    },
    currency:{
        type:true,
        required:true,
        default:"INR"
    }
},{
    timestamps:true
})

const accountModel=mongoose.model("account",accountSchema)

module.exports=accountModel


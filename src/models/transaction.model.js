const mongoose=require('mongoose')
const { applyTimestamps } = require('./account.model')

const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true
    },
    status:{
         type:String,
         enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:" Status can be either PENDING , ACTIVE ,FAILED or REVERSED "
         },
         default:"PENDING"
    },
    amount:{
        type:Number,
        required:true,
        min:[0,"Transaction must cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required for create a transaction "],
        unique:true,
        index:true
    }
},
{
    timestamps:true
})

const transactionModel=mongoose.model("transaction",transactionSchema)

module.exports=transactionModel
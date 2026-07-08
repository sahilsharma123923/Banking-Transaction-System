const mongoose=require('mongoose')
const transactionModel = require('./transaction.model')

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:true,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"Type can be either DEBIT or CREDIT"
        },
        required:true,
        immutable:true
    }
})
function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted ");
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);

const ledgerModel=mongoose.model("ledger",ledgerSchema)

module.exports=ledgerModel
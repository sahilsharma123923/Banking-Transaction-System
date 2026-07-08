const transactionModel=require('../models/transaction.model')
const ledgerModel=require('../models/ledger.model')
const accountModel=require('../models/account.model')
const emailService=require('../services/email.service')

async function createTransaction(req,res) {
    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount, toAccount , amount and idempotencyKey are required"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount
    })
    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        res.status(400).json({
            message:"Invalid fromAccount or toAccount"
        })
    }

    const isTransactionAlreadyExists=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status==="COMPLETED"){
           return res.status(200).json({
                message:"Transaction already proceded",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status==="PENDING"){
          return res.status(201 ).json({
                message:"Transaction is still processing",
            })
        }
        if(isTransactionAlreadyExists.status==="FAILED"){
           return res.status(500).json({
                message:"Transaction failed , please retry",
            })
        }
        if(isTransactionAlreadyExists.status==="REVERSED"){
           return res.status(500).json({
                message:"Transaction reversed , please retry",
            })
        }
    }

    if(fromUserAccount.status !=="ACTIVE" || toUserAccount.status !=="ACTIVE"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be active to process transaction"
        })
    }


}
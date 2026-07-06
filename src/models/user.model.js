const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            " Invalid email address"],
        unique:[true,"Email is already exist"]
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:[6,"password exceeding more than 6 character"],
        required:true,
        select:false
    }
},{
    timestamps:true    //automatically stores the date and time when a document is created (createdAt) and whenever it is updated (updatedAt).
});

userSchema.pre("save", async function() {
      
    if(!this.isModified("password")){
     return;   
    }
    
    const hash=await bcrypt.hash(this.password ,10)
    this.password=hash;
    return;
});

userSchema.methods.comparePassword= async function (password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("User",userSchema)

module.exports=userModel
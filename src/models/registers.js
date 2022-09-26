const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

const employeeSchema = new mongoose.Schema({
    firstname :{
        type:String,
        required:true,
        unique:true
    },
    lastname :{
        type:String,
        required:true,
        unique:true
    },
    email :{
        type:String,
        required:true,
        unique: true
        
    },
    gender :{
        type:String,
        required:true
    },
    phone :{
        type:Number,
        required:true,
        unique:true
    },
    age :{
        type:Number,
        required:true
    },
    file :{
        type:String
    },
    password :{
        type:String,
        required:true
    },
    confirmpassword :{
        type:String,
        required:true
    },
    
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
           const token = jwt.sign({_id:this._id.toString()},"mynameisvickeyvishnucharanshrivastava");
           this.tokens = this.tokens.concat({token:token})
           await this.save();
     
        return token;
        }
    catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);

    }
}

// converting password into hash

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password, 10);
        this.password = await bcrypt.hash(this.password, 10);
       // console.log(this.password);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
        console.log(this.confirmpassword);
    }
    next();    
})


const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
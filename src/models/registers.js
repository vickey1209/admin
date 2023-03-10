const mongoose = require("mongoose");
const bcrypt = require ("bcryptjs");
const jwt = require("jsonwebtoken");



const employeeSchema = new mongoose.Schema({
name:
     {
   
    type:String,
    required:true,
    unique:true,
   
    trim: true
    
    
     },

     email:
     {
         type:String,
         required: true,
         unique: true,
         
 
     },
     gender :{
        type:String,
        required:true
    },

     phone :{
        type: Number,
        min: 10,
        required: true
       
    },
    date :{
        type:String,
        required:true
    },
   
    hobbies :{
        type:Array
    },
    file :{
        type:String
    },
   password:
    {
        type:String,
        required:true
    },

   confirmpassword:
    {
        type:String,
    
     
    },

    tokens:[{
        token:{
            type:Array,
            required:true
        }
    }]
})

// //token generation
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},"mynameisvickeyshrivastava");
        console.log("token is " +token);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(e){
        res.send("error" +e);
        console.log("error" +e);
    }
}

// //token generation
// employeeSchema.methods.generateAuthToken = async function(){
//     try{
//         const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
//         // console.log("token is " +token);
//         this.tokens = this.tokens.concat({token:token})
//         await this.save();
//         return token;
//     }catch(e){
//         res.send("error" +e);
//         console.log("error" +e);
//     }
// }


employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password, 10);
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(this.password)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
        // console.log(this.confirmpassword)
    }
    next(); 
    
    
})







  

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
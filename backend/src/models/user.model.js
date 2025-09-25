import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        requied: true,
        unique : true,
    },
    fullname: {
        type:String,
        requied: true,
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    },
    
    },
    {timestamps: true}
);

const User = mongoose.model("User",userSchema);

export default User;
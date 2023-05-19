import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    name:String,
    age:Number,
    gender:String
});

const User = mongoose.model("User",UserModel);

export default User;
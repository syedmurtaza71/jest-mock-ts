import User from "../models/User";
import service_1 from "../services/service-1"
import {request,response} from "express";

export default {
    createUser: async (req:typeof request,res:typeof response)=>{
        const user = new User({
            name:"11",
            age:33,
            gender:"FF"
        });
       const savedUser = await user.save();
       return res.status(200).json({message:"Saved User",user:savedUser});
    },
    getUser: async (req:typeof request,res:typeof response)=>{
        const id = req.params.id;
        const foundUser = await User.findOne({_id:id});
        await service_1.service_1();
        return res.status(200).json({foundUser});
    }
}
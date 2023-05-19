import { NextFunction, request, response } from "express";

export default {
authenticate : async (req:typeof request,res:typeof response,next:NextFunction)=> {
    console.log("Original");
    next();
  }
}
import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodRawShape } from "zod";

const validateRequest =(schema: ZodObject<ZodRawShape>)=>{
   return async(req:Request, res:Response, next:NextFunction) =>{
    try {
        await schema.parseAsync({
            body:req.body
        })
        return next();
    } catch (err) {
        next(err)
    }
}
};

export default validateRequest;
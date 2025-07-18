import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status';

const loginUser =  catchAsync(async(req:Request, res:Response) =>{
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure:false,
        httpOnly:true
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true,
        message:"Logged in successfully!",
        data:{
            accessToken: result.accessToken,
            user: result.user
        }
    })
});

const refreshToken = catchAsync(async(req:Request, res:Response) =>{
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode:httpStatus.OK,
        success:true,
        message:"Access token created successfully!",
        data:result
    })
});

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerCustomer(req.body, 'CUSTOMER');
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Customer registered successfully!',
    data: result,
  });
});

export const AuthController ={
    loginUser,
    refreshToken,
    registerCustomer
}
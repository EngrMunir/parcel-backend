import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ParcelService } from "./parcel.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status';

const createParcel = catchAsync(async (req:Request & { user?:any}, res:Response)=>{
    const userId = req.user?.id;

    const result = await ParcelService.createParcel(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success:true,
        message:"Parcel booked successfully",
        data:result,
    });
});

export const ParcelController ={
    createParcel
};
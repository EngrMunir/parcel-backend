import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ParcelService } from "./parcel.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from 'http-status';

// checked
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

// checked
const getParcelsByCustomer = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id;
  const result = await ParcelService.getParcelsByCustomer(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcels retrieved successfully",
    data: result,
  });
});
// checked
const getParcelsByAgent = catchAsync(async (req: Request, res: Response) => {
  const agentId = req.params.id;
  const result = await ParcelService.getParcelsByAgent(agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcels assigned to agent retrieved successfully",
    data: result,
  });
});

// checked
const assignAgent = catchAsync(async (req: Request, res: Response) => {
  const parcelId = req.params.id;
  const { agentId } = req.body;
  const result = await ParcelService.assignAgentToParcel(parcelId, agentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent assigned successfully",
    data: result,
  });
});

// checked
const updateStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const parcelId = req.params.id;
  const agentId = req.user?.id;

  const result = await ParcelService.updateParcelStatus(parcelId, agentId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel status updated successfully",
    data: result,
  });
});

const getTrackingInfo = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const parcelId = req.params.id;
  const customerId = req.user?.id;
  const result = await ParcelService.getParcelTrackingInfo(parcelId, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel tracking info retrieved",
    data: result,
  });
});

const getAllParcels = catchAsync(async (req: Request, res: Response) => {
  const result = await ParcelService.getAllParcels();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All parcels retrieved successfully",
    data: result,
  });
});

export const ParcelController ={
    createParcel,
    getParcelsByCustomer,
    assignAgent,
    getParcelsByAgent,
    updateStatus,
    getTrackingInfo,
    getAllParcels
};
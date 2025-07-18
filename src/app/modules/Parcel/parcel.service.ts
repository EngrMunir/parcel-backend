import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { io } from "../../../server";

// checked
const createParcel = async(
    userId:string,
    payload:{
        receiverName:string;
        pickupAddress:string;
        deliveryAddress:string;
        size:string;
        type:string;
        paymentType:"COD"|"PREPAID";
    }
)=>{
    const newParcel = await prisma.parcel.create({
        data:{
            senderId:userId,
            receiverName:payload.receiverName,
            pickupAddress:payload.pickupAddress,
            deliveryAddress:payload.deliveryAddress,
            size:payload.size,
            type:payload.type,
            paymentType:payload.paymentType
        },
        include:{
            sender:{
                select:{
                    id:true,
                    name:true,
                    email:true
                },
            },
        },
    });

    return newParcel;
};
// checked
const assignAgentToParcel = async (parcelId: string, agentId: string) => {
  const updatedParcel = await prisma.parcel.update({
    where: { id: parcelId },
    data: { agentId },
    include: {
      agent: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedParcel;
};

// checked
const updateParcelStatus = async (
  parcelId: string,
  agentId: string,
  payload: { status: string; location?: string }
) => {
  
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
  });

  if (!parcel) throw new ApiError(404, "Parcel not found");
  if (parcel.agentId !== agentId) throw new ApiError(403, "You are not assigned to this parcel");
  await prisma.parcel.update({
    where: { id: parcelId },
    data: {
      status: payload.status as any,
    },
  });

  await prisma.parcelTrack.create({
    data: {
      parcelId,
      status: payload.status as any,
      location: payload.location || "Unknown",
    },
  });

  const updatedParcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      tracks: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });

  io.emit("parcelStatusUpdated", {
    parcelId,
    status: payload.status,
    updatedAt: new Date().toISOString(),
  });

  return updatedParcel;
};

const getParcelTrackingInfo = async (parcelId: string, customerId: string) => {
  const parcel = await prisma.parcel.findFirstOrThrow({
    where: {
      id: parcelId,
      senderId: customerId,
    },
    include: {
      tracks: {
        orderBy: { updatedAt: 'asc' },
      },
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return parcel;
};

// checked
const getParcelsByCustomer = async (customerId: string) => {
  return prisma.parcel.findMany({
    where: { senderId: customerId },
    orderBy: { createdAt: 'desc' },
    include: {
      agent: {
        select: { id: true, name: true, email: true },
      },
      tracks: {
        orderBy: { updatedAt: 'desc' },
        take: 1, // Only latest status
      },
    },
  });
};
// checked
const getParcelsByAgent = async (agentId: string) => {
  return prisma.parcel.findMany({
    where: { agentId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
      tracks: {
        orderBy: { updatedAt: 'desc' },
        take: 1, // Latest status
      },
    },
  });
};

const getAllParcels = async () => {
  return prisma.parcel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      agent: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tracks: {
        orderBy: { updatedAt: 'desc' },
        take: 1, // latest status only
      },
    },
  });
};


export const ParcelService ={
    createParcel,
    assignAgentToParcel,
    updateParcelStatus,
    getParcelTrackingInfo,
    getParcelsByCustomer,
    getParcelsByAgent,
    getAllParcels
}
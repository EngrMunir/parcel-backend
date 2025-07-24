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

import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ""; // Use .env

const getOptimizedRoute = async (agentId: string) => {
  // 1. Get all active parcels assigned to the agent
  const parcels = await prisma.parcel.findMany({
    where: {
      agentId,
      status: {
        in: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT","PENDING","DELIVERED","FAILED"],
  
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!parcels.length) return [];

  // 2. Map all delivery addresses (you can also include pickup if needed)
  const waypoints = parcels.map((p) => p.deliveryAddress);

  // 3. Choose a start location (e.g., pickup of first parcel)
  const origin = parcels[0].pickupAddress;
  const destination = parcels[parcels.length - 1].deliveryAddress;

  // 4. Build the request for Google Maps Directions API
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(
    destination
  )}&waypoints=optimize:true|${waypoints
    .map((w) => encodeURIComponent(w))
    .join("|")}&key=${GOOGLE_MAPS_API_KEY}`;

  // 5. Call the API
  const response = await axios.get(url);
  const optimizedRoute = response.data;

  return {
    optimizedOrder: optimizedRoute.routes?.[0]?.waypoint_order || [],
    overviewPolyline: optimizedRoute.routes?.[0]?.overview_polyline?.points || "",
    raw: optimizedRoute,
  };
};


export const ParcelService ={
    createParcel,
    assignAgentToParcel,
    updateParcelStatus,
    getParcelTrackingInfo,
    getParcelsByCustomer,
    getParcelsByAgent,
    getAllParcels,
    getOptimizedRoute
}
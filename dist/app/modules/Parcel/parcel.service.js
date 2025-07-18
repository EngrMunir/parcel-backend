"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const server_1 = require("../../../server");
// checked
const createParcel = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newParcel = yield prisma_1.default.parcel.create({
        data: {
            senderId: userId,
            receiverName: payload.receiverName,
            pickupAddress: payload.pickupAddress,
            deliveryAddress: payload.deliveryAddress,
            size: payload.size,
            type: payload.type,
            paymentType: payload.paymentType
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    email: true
                },
            },
        },
    });
    return newParcel;
});
// checked
const assignAgentToParcel = (parcelId, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedParcel = yield prisma_1.default.parcel.update({
        where: { id: parcelId },
        data: { agentId },
        include: {
            agent: {
                select: { id: true, name: true, email: true },
            },
        },
    });
    return updatedParcel;
});
// checked
const updateParcelStatus = (parcelId, agentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield prisma_1.default.parcel.findUnique({
        where: { id: parcelId },
    });
    if (!parcel)
        throw new ApiError_1.default(404, "Parcel not found");
    if (parcel.agentId !== agentId)
        throw new ApiError_1.default(403, "You are not assigned to this parcel");
    yield prisma_1.default.parcel.update({
        where: { id: parcelId },
        data: {
            status: payload.status,
        },
    });
    yield prisma_1.default.parcelTrack.create({
        data: {
            parcelId,
            status: payload.status,
            location: payload.location || "Unknown",
        },
    });
    const updatedParcel = yield prisma_1.default.parcel.findUnique({
        where: { id: parcelId },
        include: {
            sender: { select: { id: true, name: true, email: true } },
            tracks: {
                orderBy: { updatedAt: "desc" },
                take: 1,
            },
        },
    });
    server_1.io.emit("parcelStatusUpdated", {
        parcelId,
        status: payload.status,
        updatedAt: new Date().toISOString(),
    });
    return updatedParcel;
});
const getParcelTrackingInfo = (parcelId, customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield prisma_1.default.parcel.findFirstOrThrow({
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
});
// checked
const getParcelsByCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.parcel.findMany({
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
});
// checked
const getParcelsByAgent = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.parcel.findMany({
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
});
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.parcel.findMany({
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
});
exports.ParcelService = {
    createParcel,
    assignAgentToParcel,
    updateParcelStatus,
    getParcelTrackingInfo,
    getParcelsByCustomer,
    getParcelsByAgent,
    getAllParcels
};

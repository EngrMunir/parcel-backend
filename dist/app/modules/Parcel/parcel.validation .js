"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusZodSchema = exports.assignAgentZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createParcelZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        receiverName: zod_1.default.string().min(1, "Receiver name is required"),
        pickupAddress: zod_1.default.string().min(1, "Pickup address is required"),
        deliveryAddress: zod_1.default.string().min(1, "Delivery address is required"),
        size: zod_1.default.string().min(1, "Parcel size is required"),
        type: zod_1.default.string().min(1, "Parcel size is required"),
        paymentType: zod_1.default.enum(["COD", "PREPAID"]),
    }),
});
exports.assignAgentZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        agentId: zod_1.default.string().uuid("A valid agentId is required"),
    }),
});
exports.updateStatusZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        status: zod_1.default.enum(["PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED"]),
        location: zod_1.default.string().optional(),
    }),
});

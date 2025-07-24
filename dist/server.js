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
exports.io = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./shared/prisma")); // adjust path as needed
const port = process.env.PORT || 5000;
const server = (0, http_1.createServer)(app_1.default);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["https://courier-rosy.vercel.app"],
        credentials: true,
    },
});
exports.io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    // Listen for agent location updates
    socket.on("locationUpdate", (_a) => __awaiter(void 0, [_a], void 0, function* ({ parcelId, latitude, longitude }) {
        try {
            // Update parcel location in DB
            yield prisma_1.default.parcel.update({
                where: { id: parcelId },
                data: {
                    currentLatitude: latitude,
                    currentLongitude: longitude,
                },
            });
            // Broadcast to all clients
            exports.io.emit("parcelLocationUpdated", {
                parcelId,
                latitude,
                longitude,
            });
            console.log(`Location updated for parcel ${parcelId}`);
        }
        catch (error) {
            console.error("Failed to update parcel location:", error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

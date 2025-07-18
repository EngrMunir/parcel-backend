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
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const date_fns_1 = require("date-fns");
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const totalParcels = yield prisma_1.default.parcel.count();
    const codCount = yield prisma_1.default.parcel.count({
        where: { paymentType: "COD" },
    });
    const prepaidCount = yield prisma_1.default.parcel.count({
        where: { paymentType: "PREPAID" },
    });
    const failedDeliveries = yield prisma_1.default.parcel.count({
        where: { status: "FAILED" },
    });
    const todayBookings = yield prisma_1.default.parcel.count({
        where: {
            createdAt: {
                gte: (0, date_fns_1.startOfDay)(now),
                lte: (0, date_fns_1.endOfDay)(now),
            },
        },
    });
    const recentParcels = yield prisma_1.default.parcel.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            sender: { select: { name: true, email: true } },
            agent: { select: { name: true } },
        },
    });
    return {
        totalParcels,
        codCount,
        prepaidCount,
        failedDeliveries,
        todayBookings,
        recentParcels,
    };
});
exports.DashboardService = {
    getDashboardStats,
};

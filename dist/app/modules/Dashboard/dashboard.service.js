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
const dayjs_1 = __importDefault(require("dayjs"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
exports.DashboardService = {
    getDashboardStats: () => __awaiter(void 0, void 0, void 0, function* () {
        // Total parcels
        const totalParcels = yield prisma_1.default.parcel.count();
        // Group by status
        const statusCountsRaw = yield prisma_1.default.parcel.groupBy({
            by: ["status"],
            _count: true,
        });
        const statusCounts = {};
        statusCountsRaw.forEach((item) => {
            statusCounts[item.status] = item._count;
        });
        // Today's parcels
        const today = (0, dayjs_1.default)().startOf("day").toDate();
        const tomorrow = (0, dayjs_1.default)().add(1, "day").startOf("day").toDate();
        const todayParcels = yield prisma_1.default.parcel.count({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        // Last 7 days trend
        const last7DaysParcels = [];
        for (let i = 6; i >= 0; i--) {
            const date = (0, dayjs_1.default)().subtract(i, "day").startOf("day");
            const nextDate = date.add(1, "day");
            const count = yield prisma_1.default.parcel.count({
                where: {
                    createdAt: {
                        gte: date.toDate(),
                        lt: nextDate.toDate(),
                    },
                },
            });
            last7DaysParcels.push({
                date: date.format("YYYY-MM-DD"),
                count,
            });
        }
        // Total customers
        const totalCustomers = yield prisma_1.default.user.count({
            where: { role: "CUSTOMER" },
        });
        // Total agents
        const totalAgents = yield prisma_1.default.user.count({
            where: { role: "AGENT" },
        });
        return {
            totalParcels,
            statusCounts,
            todayParcels,
            last7DaysParcels,
            totalCustomers,
            totalAgents,
        };
    }),
};

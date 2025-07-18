import prisma from "../../../shared/prisma";
import { startOfDay, endOfDay } from "date-fns";

const getDashboardStats = async () => {
  const now = new Date();

  const totalParcels = await prisma.parcel.count();

  const codCount = await prisma.parcel.count({
    where: { paymentType: "COD" },
  });

  const prepaidCount = await prisma.parcel.count({
    where: { paymentType: "PREPAID" },
  });

  const failedDeliveries = await prisma.parcel.count({
    where: { status: "FAILED" },
  });

  const todayBookings = await prisma.parcel.count({
    where: {
      createdAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
  });

  const recentParcels = await prisma.parcel.findMany({
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
};

export const DashboardService = {
  getDashboardStats,
};

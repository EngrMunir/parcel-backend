
import dayjs from "dayjs";
import prisma from "../../../shared/prisma";

export const DashboardService = {
  getDashboardStats: async () => {
    // Total parcels
    const totalParcels = await prisma.parcel.count();

    // Group by status
    const statusCountsRaw = await prisma.parcel.groupBy({
      by: ["status"],
      _count: true,
    });

    const statusCounts: Record<string, number> = {};
    statusCountsRaw.forEach((item) => {
      statusCounts[item.status] = item._count;
    });

    // Today's parcels
    const today = dayjs().startOf("day").toDate();
    const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

    const todayParcels = await prisma.parcel.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Last 7 days trend
    const last7DaysParcels: { date: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, "day").startOf("day");
      const nextDate = date.add(1, "day");

      const count = await prisma.parcel.count({
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
    const totalCustomers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    });

    // Total agents
    const totalAgents = await prisma.user.count({
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
  },
};

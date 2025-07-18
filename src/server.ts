import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import prisma from "./shared/prisma"; // adjust path as needed

const port = process.env.PORT || 5000;
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for agent location updates
  socket.on("locationUpdate", async ({ parcelId, latitude, longitude }) => {
    try {
      // Update parcel location in DB
      await prisma.parcel.update({
        where: { id: parcelId },
        data: {
          currentLatitude: latitude,
          currentLongitude: longitude,
        },
      });

      // Broadcast to all clients
      io.emit("parcelLocationUpdated", {
        parcelId,
        latitude,
        longitude,
      });

      console.log(`Location updated for parcel ${parcelId}`);
    } catch (error) {
      console.error("Failed to update parcel location:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

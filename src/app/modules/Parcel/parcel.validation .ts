import z from "zod";

export const createParcelZodSchema = z.object({
    body:z.object({
        receiverName: z.string().min(1,"Receiver name is required"),
        pickupAddress:z.string().min(1,"Pickup address is required"),
        deliveryAddress:z.string().min(1,"Delivery address is required"),
        size:z.string().min(1,"Parcel size is required"),
        type:z.string().min(1,"Parcel size is required"),
        paymentType: z.enum(["COD","PREPAID"]),
    }),
});

export const assignAgentZodSchema = z.object({
  body: z.object({
    agentId: z.string().uuid("A valid agentId is required"),
  }),
});

export const updateStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(["PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED"]),
    location: z.string().optional(),
  }),
});


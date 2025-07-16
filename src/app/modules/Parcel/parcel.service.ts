import prisma from "../../../shared/prisma";

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

export const ParcelService ={
    createParcel
}
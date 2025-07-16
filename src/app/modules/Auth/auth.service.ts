import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';

const loginUser = async(payload:{
    email:string,
    password:string
}) =>{
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:payload.email
        }
    });

    const isCorrectPassword:boolean = await bcrypt.compare(payload.password, userData.password);
    if(!isCorrectPassword){
        throw new Error('Password incorrect!');
    }

    const accessToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
);

    const refreshToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
)

return {
    accessToken,
    refreshToken
};
}

const refreshToken = async(token:string) =>{
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);

    } catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email:decodedData.email,
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
);

return {
    accessToken
}
}

export const AuthServices ={
    loginUser,
    refreshToken
}
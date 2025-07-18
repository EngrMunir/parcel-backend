import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma"
import * as bcrypt from 'bcrypt';
import { UserRole } from "../../../../generated/prisma";

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
        id: userData.id,
        email:userData.email,
        role:userData.role
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
);

    const refreshToken = jwtHelpers.generateToken({
        id: userData.id,
        email:userData.email,
        role:userData.role
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
)

return {
    accessToken,
    refreshToken,
    user: {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    name: userData.name
  }
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
        id: userData.id,
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

const registerCustomer = async (payload: {
  name: string;
  email: string;
  password: string;
}, role: UserRole) => {
  
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const AuthServices ={
    loginUser,
    refreshToken,
    registerCustomer
}
import { Request, Response } from "express";
import { userService } from "./user.service";
import httpStatus from 'http-status';
import sendResponse from "../../../shared/sendResponse";


const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User fetched successfully!",
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Something went wrong while fetching user!",
      data: null,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
    const { role } = req.query;

    const users = await userService.getAllUsers(role as string | undefined);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users fetched successfully!",
      data: users,
    });
};


export const userController ={
    getUserById,
    getAllUsers
}
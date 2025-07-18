import prisma from "../../../shared/prisma";

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return user;
};

const getAllUsers = async (role?: string) => {
  const filter: any = {};

  if (role) {
    filter.role = role;
  }

  const users = await prisma.user.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return users;
};


export const userService ={
    getUserById,
    getAllUsers
}
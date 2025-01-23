import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      roles: { include: { role: true } },
      idImage: true,
      profileImage: true,
    },
  });
};

export const updateUserProfile = async (id: number, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const updateUserSecurity = async (
  id: number,
  securityData: { emailVerified?: boolean; phoneVerified?: boolean }
) => {
  return await prisma.user.update({
    where: { id },
    data: securityData,
  });
};

export const getUserNotifications = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { roles: true }, // Replace with notifications when defined
  });
};

export const changePassword = async (
  id: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.password !== currentPassword) {
    throw new Error("Invalid current password");
  }

  return await prisma.user.update({
    where: { id },
    data: { password: newPassword },
  });
};

export const deleteUserProfile = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

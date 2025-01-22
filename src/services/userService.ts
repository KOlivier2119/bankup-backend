import { Prisma, User } from "@prisma/client";
import prisma from "../lib/prisma";

export class UserService {
    public static async getUserById(userId: number): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id: userId },
        });
    }
    public static async getUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    public static async updateUser(userId: number, updateData: Prisma.UserUpdateInput): Promise<User | null> {
        return await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    }

    public static async deleteUser(userId: number): Promise<User | null> {
        return await prisma.user.delete({
            where: { id: userId },
        });
    }

    public static async getAllUsers(): Promise<User[]> {
        return await prisma.user.findMany();
    }
}
import { Role, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { createRoleType } from "../validators";
import { DEFAULT_ROLES } from "../enums";

export class RoleService {
  public static async createRole(role: createRoleType): Promise<Role> {
    return await prisma.role.create({ data: role });
  }
  public static async getRoleById(id: number) {
    return await prisma.role.findUnique({ where: { id } });
  }
  public static async ensureRoles() {
    // Define the roles you want to ensure exist in the database
    const predefinedRoles = Object.values(DEFAULT_ROLES);
    for (const roleName of predefinedRoles) {
      // Use `upsert` to create the role if it doesn't exist
      await prisma.role.upsert({
        where: { name: roleName },
        update: {}, // No update needed if the role exists
        create: { name: roleName, isProtected: true }, // Create the role if it doesn't exist
      });
    }
  }
  public static async getRoleByName(name: string) {
    return await prisma.role.findUnique({ where: { name } });
  }
  public static async getAllRoles() {
    return await prisma.role.findMany();
  }

  public static async findOne(where: Prisma.RoleWhereUniqueInput) {
    return await prisma.role.findFirst({ where });
  }
  public static async updateRole(id: number) {
    // Implementation
  }
  public static async deleteRole(id: number) {
    const defuatRoles: string[] = Object.values(DEFAULT_ROLES);
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });
    const roleUserCount = role?._count?.userRoles??0;
    if(!role) {
        return { status: 404, message: "Role not found" };
    }
    if(defuatRoles.includes(role.name) || role.isProtected) {
        return { status: 403, message: `Cannot delete ${role.name} role is protected` };
    }
    if (roleUserCount > 0) {
      return{
        status: 400,
        message: "Cannot delete role with users assigned to it",
      }
    }
    await prisma.role.delete({ where: { id } });
    return { status: 200, message: "Role deleted successfully" };
  }
}

import { UploadType } from "@prisma/client";
import prisma from "../lib/prisma";
import { registerType } from "../validators/auth";
import { RoleService } from "./roleService";
import { DEFAULT_ROLES } from "../enums";
import { UploadApiResponse } from "cloudinary";

export class AuthService {
  public static async registerWithEmail(
    dada: registerType,
    idFile: UploadApiResponse,
    profileFile: UploadApiResponse
  ) {
    // get the role to assign to the user
    const role = await RoleService.getRoleByName(DEFAULT_ROLES.USER);
    return await prisma.user.create({
      data: {
        ...dada,
        idImage: {
          create: {
            url: idFile.secure_url,
            type: UploadType.image,
            publicId: idFile.public_id,
          },
        },
        profileImage: {
          create: {
            url: profileFile.secure_url,
            type: UploadType.image,
            publicId: profileFile.public_id,
          },
        },
        roles: {
          create: {
            roleId: role?.id ?? 0,
          },
        },
      },
      include: {
        idImage: true,
        profileImage: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
  async loginWithEmail(email: string, password: string) {
    // Implementation
  }

  async loginWithPhone(phoneNumber: string, password: string) {
    // Implementation
  }

  async verifyEmailCode(email: string, verificationCode: string) {
    // Implementation
  }

  async verifyPhoneOTP(phoneNumber: string, otp: string) {
    // Implementation
  }
}

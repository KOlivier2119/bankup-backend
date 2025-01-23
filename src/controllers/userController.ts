import { Request, Response } from "express";
import {
  getUserById,
  updateUserProfile,
  updateUserSecurity,
  getUserNotifications,
  changePassword,
  deleteUserProfile,
} from "../models/User";

export default async function getUserProfile(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id);
        console.log(id);
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = await updateUserProfile(id, req.body);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSecurity = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { emailVerified, phoneVerified } = req.body;
    await updateUserSecurity(id, { emailVerified, phoneVerified });
    res.json({ message: "Security settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const notifications = await getUserNotifications(id);
    res.json({ notifications });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
    res.status(500).json({ message: errorMessage });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { currentPassword, newPassword } = req.body;
    await changePassword(id, currentPassword, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteUserProfile(id);
    res.json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

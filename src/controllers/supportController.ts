import { Request, Response } from "express";
import * as supportService from "../services/supportService";
import { randomBytes } from "crypto";

// Send contact message
export const sendContactMessage = async (req: Request, res: Response) => {
  const { subject, message } = req.body;

  try {
    if (!req.user) {
       res.status(400).json({ message: "User not authenticated" });
       return;
    }
    const userId = Number(req.user.id);
    const chatId = Number(randomBytes(4).toString("hex"));
    const response = await supportService.sendContactMessage(subject, message, chatId, userId, );
     res.status(201).json(response);
     return;
  } catch (error) {
     res.status(500).json({ message: "Error sending message", error });
     return;
  }
};

// Start live chat
export const startLiveChat = async (req: Request, res: Response) => {
  try {
    const chat = await supportService.startLiveChat();
     res.status(201).json({ chatId: chat.id });
     return;
  } catch (error) {
     res.status(500).json({ message: "Error starting chat", error });
     return;
  }
};

// Get chat messages
export const getChatMessages = async (req: Request, res: Response) => {
  const chatId = Number(req.params.id);

  try {
    const messages = await supportService.getChatMessages(chatId);
    if (!messages.length) {
       res.status(404).json({ message: "No messages found" });
       return;
    }
     res.status(200).json(messages);
     return;
  } catch (error) {
     res.status(500).json({ message: "Error fetching messages", error });
     return;
  }
};

// Delete chat
export const deleteChat = async (req: Request, res: Response) => {
  const chatId = Number(req.params.id);

  try {
    await supportService.deleteChat(chatId);
     res.status(200).json({ message: "Chat deleted successfully" });
     return;
  } catch (error) {
     res.status(500).json({ message: "Error deleting chat", error });
     return;
  }
};
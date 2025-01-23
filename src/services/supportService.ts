import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Send contact message
export const sendContactMessage = async (subject: string, message: string, chatId: number, userId: number) => {
  return await prisma.supportMessage.create({
    data: { subject, message, chat: { connect: { id: chatId } }, user: { connect: { id: userId } } },
  });
};

// Start a live chat
export const startLiveChat = async () => {
  return await prisma.supportChat.create({
    data: {},
  });
};

// Get chat messages
export const getChatMessages = async (chatId: number) => {
  return await prisma.supportMessage.findMany({
    where: { chatId },
  });
};

// Delete chat
export const deleteChat = async (chatId: number) => {
  return await prisma.supportChat.delete({
    where: { id: chatId },
  });
};
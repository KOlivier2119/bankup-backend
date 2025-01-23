import { PrismaClient } from "@prisma/client";
import { LoanStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Users
export const getAllUsers = async (page: number, limit: number) => {
  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.user.count();
  return { users, total };
};

export const getUserDetails = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUserStatus = async (id: number, status: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isBlocked: status },
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};

//Loans

export const getAllLoans = async (page: number, limit: number, status: LoanStatus) => {
  const loans = await prisma.loan.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: { status },
  });
  const total = await prisma.loan.count();
  return { loans, total };
};

export const updateLoanStatus = async (id: number, status: LoanStatus, comment: string) => {
  return prisma.loan.update({
    where: { id },
    data: { status, comment },
  });
};

export const deleteLoan = async (id: number) => {
  return prisma.loan.delete({ where: { id } });
};

// Reports
export const getLoanReports = async (startDate: Date, endDate: Date) => {
  return prisma.loan.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
  });
};

export const getPaymentReports = async (startDate: Date, endDate: Date) => {
  return prisma.payment.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
  });
};
export function updateLoanTerms(arg0: number, newAmount: any, newTerm: any) {
  throw new Error("Function not implemented.");
}


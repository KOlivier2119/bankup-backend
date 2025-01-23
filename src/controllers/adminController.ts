import { Request, Response } from "express";
import * as adminService from "../services/adminService";
import { boolean } from "zod";
import { LoanStatus } from "@prisma/client";

// Users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await adminService.getAllUsers(Number(page), Number(limit));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await adminService.getUserDetails(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
    return;
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    await adminService.updateUserStatus(Number(req.params.id), status);
    res.status(200).json({ message: "User status updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status", error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await adminService.deleteUser(Number(req.params.id));
    if (!deleted) res.status(404).json({ message: "User not found" });
    return;
    res.status(200).json({ message: "User deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
    return;
  }
};

// Loans
export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const loans = await adminService.getAllLoans(Number(page), Number(limit), status as LoanStatus);
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loans", error });
  }
};

export const approveLoan = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const updatedLoan = await adminService.updateLoanStatus(parseInt(loanId), "approved", "");
    if (updatedLoan) {
      res.status(200).json({ message: "Loan approved successfully" });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error approving loan", error });
  }
};

export const rejectLoan = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const updatedLoan = await adminService.updateLoanStatus(parseInt(loanId), "rejected", "");
    if (updatedLoan) {
      res.status(200).json({ message: "Loan rejected successfully" });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error rejecting loan", error });
  }
};

export const updateLoanTerms = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const { newAmount, newTerm } = req.body;
    const updateResult = await adminService.updateLoanTerms(parseInt(loanId), newAmount, newTerm);
    if (updateResult !== undefined) {
      res.status(200).json({ message: "Loan terms updated successfully", loan: updateResult });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating loan terms", error });
  }
};

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const updateLoadStatus = await adminService.updateLoanStatus(parseInt(id), status, comment);
    if (updateLoadStatus !== undefined) {
      res.status(200).json({ message: "Loan status updated successfully", loan: updateLoadStatus });
    } else {
      res.status(404).json({ message: "Loan not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating loan status", error });
  }
}

// Reports
export const getLoanReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await adminService.getLoanReports(new Date(startDate as string), new Date(endDate as string));
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan reports", error });
  }
};

export const getPaymentReports = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await adminService.getPaymentReports(new Date(startDate as string), new Date(endDate as string));
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment reports", error });
  }
};
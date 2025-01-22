import { Request, Response } from 'express';
import LoanModel from '../models/Loan';
import UserModel from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const loans = await LoanModel.findAll();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loans', error });
  }
};

export const approveLoan = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const updatedLoan = await LoanModel.updateStatus(parseInt(loanId), 'approved');

    if (updatedLoan) {
      res.status(200).json({ message: 'Loan approved successfully' });
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error approving loan', error });
  }
};

export const rejectLoan = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const updatedLoan = await LoanModel.updateStatus(parseInt(loanId), 'rejected');

    if (updatedLoan) {
      res.status(200).json({ message: 'Loan rejected successfully' });
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting loan', error });
  }
};

export const updateLoanTerms = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const { newAmount, newTerm } = req.body;

    const updatedLoan = await LoanModel.updateTerms(parseInt(loanId), newAmount, newTerm);

    if (updatedLoan) {
      res.status(200).json({ message: 'Loan terms updated successfully', loan: updatedLoan });
    } else {
      res.status(404).json({ message: 'Loan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating loan terms', error });
  }
};


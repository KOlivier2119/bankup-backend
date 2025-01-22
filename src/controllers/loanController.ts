//@ts-nocheck

import { Request, Response } from 'express';
import LoanModel from '../models/Loan';
import UserModel from '../models/User';

export const applyForLoan = async (req: Request, res: Response) => {
  try {
    const { userId, amount, purpose, term, paymentFrequency, guarantorName, guarantorRelationship, guarantorIdUrl } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newLoan = await LoanModel.create({
      userId,
      amount,
      purpose,
      term,
      paymentFrequency,
      guarantorName,
      guarantorRelationship,
      guarantorIdUrl,
      status: 'pending',
    });

    res.status(201).json({ message: 'Loan application submitted successfully', loanId: newLoan.id });
  } catch (error) {
    res.status(500).json({ message: 'Error applying for loan', error });
  }
};

export const getLoanDetails = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;
    const loan = await LoanModel.findById(parseInt(loanId));

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan details', error });
  }
};

export const getUserLoans = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const loans = await LoanModel.findByUserId(parseInt(userId));

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user loans', error });
  }
};

export const topUpLoan = async (req: Request, res: Response) => {
  try {
    const { loanId, additionalAmount, newTerm } = req.body;

    const updatedLoan = await LoanModel.topUp(loanId, additionalAmount, newTerm);

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan not found or not active' });
    }

    res.status(200).json({ message: 'Loan topped up successfully', loan: updatedLoan });
  } catch (error) {
    res.status(500).json({ message: 'Error topping up loan', error });
  }
};

export const liquidateLoan = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;

    const loan = await LoanModel.findById(parseInt(loanId));

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({ message: 'Only active loans can be liquidated' });
    }

    const updatedLoan = await LoanModel.updateStatus(loan.id, 'closed');

    if (updatedLoan) {
      res.status(200).json({ message: 'Loan liquidated successfully' });
    } else {
      res.status(500).json({ message: 'Failed to liquidate loan' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error liquidating loan', error });
  }
};


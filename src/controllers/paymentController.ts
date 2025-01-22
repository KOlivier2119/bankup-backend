import { Request, Response } from 'express';
import PaymentModel from '../models/Payment';
import LoanModel from '../models/Loan';

export const makePayment = async (req: Request, res: Response) => {
  try {
    const { loanId, amount, paymentMethod } = req.body;

    const loan = await LoanModel.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const payment = await PaymentModel.create({
      loanId,
      amount,
      paymentMethod,
    });

    res.status(201).json({ message: 'Payment successful', paymentId: payment.id });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params;

    const payments = await PaymentModel.findByLoanId(parseInt(loanId));

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment history', error });
  }
};

export const generatePaymentStatement = async (req: Request, res: Response) => {
  try {
    const { loanId, startDate, endDate } = req.query;

    const payments = await PaymentModel.getPaymentsBetweenDates(
      parseInt(loanId as string),
      new Date(startDate as string),
      new Date(endDate as string)
    );

    // Generate PDF statement (implementation depends on your PDF generation library)
    // const pdfBuffer = generatePDFStatement(payments);

    res.status(200).json({
      message: 'Payment statement generated successfully',
      // statement: pdfBuffer.toString('base64')
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating payment statement', error });
  }
};


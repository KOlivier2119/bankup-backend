import express from 'express';
import * as adminController from '../../controllers/adminController';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();

router.use(authenticateToken);
router.use(isAdmin);

router.post('/loans/:loanId/approve', adminController.approveLoan);
router.post('/loans/:loanId/reject', adminController.rejectLoan);
router.put('/loans/:loanId/terms', adminController.updateLoanTerms);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/loans', adminController.getAllLoans);
router.put('/loans/:id/status', adminController.updateLoanStatus);
router.delete('/loans/:id', adminController.rejectLoan);
router.get('/reports/loans', adminController.getAllLoans);
router.get('/reports/payments', adminController.getPaymentReports);

export default router;


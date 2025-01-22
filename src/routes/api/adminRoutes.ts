import express from 'express';
import * as adminController from '../../controllers/adminController';
import { authenticateToken, isAdmin } from '../../middleware/auth';

const router = express.Router();

router.use,(authenticateToken);
router.use,(isAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/loans', adminController.getAllLoans);
router.post('/loans/:loanId/approve', adminController.approveLoan);
router.post('/loans/:loanId/reject', adminController.rejectLoan);
router.put('/loans/:loanId/terms', adminController.updateLoanTerms);

export default router;


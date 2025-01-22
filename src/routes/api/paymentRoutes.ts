import express from "express";
import * as paymentController from "../../controllers/paymentController";
import { authenticateToken } from "../../middleware/auth";

const router = express.Router();

router.use, authenticateToken;

router.post("/make", paymentController.makePayment);
router.get("/history/:loanId", paymentController.getPaymentHistory);
router.get("/statement", paymentController.generatePaymentStatement);

export default router;

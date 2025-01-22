import express from "express";
import * as loanController from "../../controllers/loanController";
import { authenticateToken } from "../../middleware/auth";

const router = express.Router();

router.use, authenticateToken;
//@ts-ignore
router.post("/apply", loanController.applyForLoan);
//@ts-ignore
router.get("/:loanId", loanController.getLoanDetails);
//@ts-ignore
//@ts-ignore
router.get("/user/:userId", loanController.getUserLoans);
//@ts-ignore
router.post("/topup", loanController.topUpLoan);
//@ts-ignore
router.post("/liquidate/:loanId", loanController.liquidateLoan);

export default router;

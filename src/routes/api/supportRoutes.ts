import * as supportController from "../../controllers/supportController";
import express from "express";

const router = express.Router();

router.post("/contact", supportController.sendContactMessage);
router.post("/chat", supportController.startLiveChat);
router.get("/chat/:id", supportController.getChatMessages);
router.delete("/chat/:id", supportController.deleteChat);

export default router;
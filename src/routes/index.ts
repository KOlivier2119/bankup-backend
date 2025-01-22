import { Router } from "express";
import authRoutes from "./api/authRoutes";
import rolesRoutes from "./api/rolesRoutes";
import NotFoundController from "../controllers/notFoudController";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);

router.all("*", NotFoundController.notFound);

export default router;
import { Router } from "express";
import authRoutes from "./api/authRoutes";
import rolesRoutes from "./api/rolesRoutes";
import NotFoundController from "../controllers/notFoudController";
import userRoutes from "./api/userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);
router.use("/users", userRoutes);

router.all("*", NotFoundController.notFound);

export default router;
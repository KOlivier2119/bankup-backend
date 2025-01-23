import { Router } from "express";
import authRoutes from "./api/authRoutes";
import rolesRoutes from "./api/rolesRoutes";
import NotFoundController from "../controllers/notFoudController";
import userRoutes from "./api/userRoutes";
import adminRoutes from "./api/adminRoutes";
import supportRoutes from "./api/supportRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", rolesRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/support", supportRoutes);

router.all("*", NotFoundController.notFound);

export default router;
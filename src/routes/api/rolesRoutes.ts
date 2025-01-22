import express from "express";
import { RolesController } from "../../controllers/rolesController";
import { validateRole } from "../../validators";
import { authenticateToken, isAdmin } from "../../middleware";

const router = express.Router();

router.get("/", RolesController.getAllRoles);
router.post("/", authenticateToken, isAdmin, validateRole, RolesController.createRole);
router.delete("/:id", authenticateToken, isAdmin, RolesController.deleteRole);

export default router;
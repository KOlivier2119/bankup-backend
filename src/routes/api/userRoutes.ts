import express from "express";
import getUserProfile, {
  updateProfile,
  updateSecurity,
  getNotifications,
  changeUserPassword,
  deleteProfile,
} from "../../controllers/userController";

const router = express.Router();

router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateProfile);
router.put("/security/:id", updateSecurity);
router.get("/notifications/:id", getNotifications);
router.put("/change-password/:id", changeUserPassword);
router.delete("/delete-profile/:id", deleteProfile);

export default router;

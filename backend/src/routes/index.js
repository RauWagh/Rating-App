import express from "express";
import { signup, login, changePassword } from "../controllers/authController.js";
import { getDashboardCounts, adminCreateUser, adminListUsers, adminCreateStore, adminListStores, adminGetUserDetails } from "../controllers/adminController.js";
import { listStores, submitRating } from "../controllers/userController.js";
import { getOwnerDashboard } from "../controllers/ownerController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Auth
router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/change-password", requireAuth, changePassword);

// Admin
router.get("/admin/dashboard", requireAuth, requireRole("ADMIN"), getDashboardCounts);
router.post("/admin/users", requireAuth, requireRole("ADMIN"), adminCreateUser);
router.get("/admin/users", requireAuth, requireRole("ADMIN"), adminListUsers);
router.get("/admin/users/:id", requireAuth, requireRole("ADMIN"), adminGetUserDetails);
router.post("/admin/stores", requireAuth, requireRole("ADMIN"), adminCreateStore);
router.get("/admin/stores", requireAuth, requireRole("ADMIN"), adminListStores);

// User
router.get("/stores", requireAuth, listStores);
router.post("/ratings", requireAuth, submitRating);

// Owner
router.get("/owner/dashboard", requireAuth, requireRole("OWNER"), getOwnerDashboard);

export default router;


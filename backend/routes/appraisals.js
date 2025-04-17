import express from "express";
import {
  getAppraisals,
  getAppraisalById,
  createAppraisal,
  updateAppraisal,
  deleteAppraisal,
  getManagerAppraisals,
  getUserAppraisals,
  getTargetUserAppraisals,
} from "../controllers/appraisalController.js";
import { protect, admin, manager } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getAppraisals);

// Create appraisal
router.post("/", protect, createAppraisal);

// Get appraisal by ID
router.get("/:id", protect, getAppraisalById);

// Update appraisal by ID
router.put("/:id", protect, updateAppraisal);

// Delete appraisal by ID
router.delete("/:id", protect, deleteAppraisal);

// Get appraisals for a specific manager's team
router.get("/manager/:id", protect, manager, getManagerAppraisals);

// Get appraisals submitted by a specific user
router.get("/user/:id", protect, getUserAppraisals);

// Get appraisals by a specific target user
router.get("/target/:id", protect, getTargetUserAppraisals);

export default router;

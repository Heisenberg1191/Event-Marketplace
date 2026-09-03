import { Router } from "express";
import {
  createVendorProfile,
  getVendors,
  getVendorById,
} from "../controllers/vendor.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", getVendors);
router.get("/:id", getVendorById);
router.post("/", protect, authorize("VENDOR"), createVendorProfile);

export default router;
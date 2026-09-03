import { Router } from "express";
import {
  createService,
  createPackage,
  getMyServices,
} from "../controllers/vendorService.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("VENDOR"));

router.get("/", getMyServices);
router.post("/", createService);
router.post("/:serviceId/packages", createPackage);

export default router;
import { Router } from "express";
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// All event routes require login, and only customers can manage events
router.use(protect, authorize("CUSTOMER"));

router.post("/", createEvent);
router.get("/", getMyEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
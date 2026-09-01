import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./src/routes/health.routes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

// 404 + error handling (must be last, in this order)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import prisma from "../config/prisma.js";

export const getHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Event Marketplace API is running",
    timestamp: new Date().toISOString(),
  });
};

export const getDbHealth = async (req, res, next) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      message: "Database connected",
      userCount,
    });
  } catch (error) {
    next(error);
  }
};
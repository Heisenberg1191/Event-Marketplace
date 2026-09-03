import prisma from "../config/prisma.js";

// Vendor adds a new service (e.g. "Wedding Photography")
export const createService = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({
        status: "error",
        message: "You need to create a vendor profile first",
      });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Service title is required",
      });
    }

    const service = await prisma.vendorService.create({
      data: {
        vendorId: vendor.id,
        title,
        description: description || null,
      },
    });

    res.status(201).json({ status: "ok", service });
  } catch (error) {
    next(error);
  }
};

// Vendor adds a pricing package to one of their services
export const createPackage = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({
        status: "error",
        message: "You need to create a vendor profile first",
      });
    }

    const service = await prisma.vendorService.findUnique({
      where: { id: req.params.serviceId },
    });

    if (!service || service.vendorId !== vendor.id) {
      return res.status(404).json({
        status: "error",
        message: "Service not found",
      });
    }

    const { name, price, description } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Package name and price are required",
      });
    }

    const servicePackage = await prisma.servicePackage.create({
      data: {
        vendorServiceId: service.id,
        name,
        price: parseFloat(price),
        description: description || null,
      },
    });

    res.status(201).json({ status: "ok", servicePackage });
  } catch (error) {
    next(error);
  }
};

// Vendor's own services list (for their dashboard)
export const getMyServices = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(404).json({
        status: "error",
        message: "You need to create a vendor profile first",
      });
    }

    const services = await prisma.vendorService.findMany({
      where: { vendorId: vendor.id },
      include: { packages: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ status: "ok", services });
  } catch (error) {
    next(error);
  }
};
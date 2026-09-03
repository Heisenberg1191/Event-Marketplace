import prisma from "../config/prisma.js";

// Vendor creates/completes their business profile
export const createVendorProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "VENDOR") {
      return res.status(403).json({
        status: "error",
        message: "Only vendor accounts can create a business profile",
      });
    }

    const existing = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "You already have a vendor profile",
      });
    }

    const { businessName, description, location } = req.body;

    if (!businessName || !location) {
      return res.status(400).json({
        status: "error",
        message: "Business name and location are required",
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId: req.user.id,
        businessName,
        description: description || null,
        location,
      },
    });

    res.status(201).json({ status: "ok", vendor });
  } catch (error) {
    next(error);
  }
};

// Public: browse/search vendors
export const getVendors = async (req, res, next) => {
  try {
    const { search, location, category } = req.query;

    const where = {
      isApproved: true,
      ...(search && {
        businessName: { contains: search, mode: "insensitive" },
      }),
      ...(location && {
        location: { contains: location, mode: "insensitive" },
      }),
      ...(category && {
        categories: { some: { category: { slug: category } } },
      }),
    };

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        categories: { include: { category: true } },
        portfolio: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ status: "ok", count: vendors.length, vendors });
  } catch (error) {
    next(error);
  }
};

// Public: single vendor profile
export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: {
        categories: { include: { category: true } },
        services: { include: { packages: true } },
        portfolio: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        status: "error",
        message: "Vendor not found",
      });
    }

    res.json({ status: "ok", vendor });
  } catch (error) {
    next(error);
  }
};
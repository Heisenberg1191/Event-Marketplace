import prisma from "../config/prisma.js";

// Customer requests a booking: adds a service package to their event
export const requestBooking = async (req, res, next) => {
  try {
    const { eventId, servicePackageId } = req.body;

    if (!eventId || !servicePackageId) {
      return res.status(400).json({
        status: "error",
        message: "eventId and servicePackageId are required",
      });
    }

    // Verify the event belongs to this customer
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.customerId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "You do not have access to this event",
      });
    }

    // Verify the service package exists
    const servicePackage = await prisma.servicePackage.findUnique({
      where: { id: servicePackageId },
    });
    if (!servicePackage) {
      return res.status(404).json({
        status: "error",
        message: "Service package not found",
      });
    }

    // Create the EventService link, then the Booking in PENDING state
    const eventService = await prisma.eventService.create({
      data: {
        eventId,
        servicePackageId,
      },
    });

    const booking = await prisma.booking.create({
      data: {
        eventServiceId: eventService.id,
        status: "PENDING",
      },
    });

    res.status(201).json({ status: "ok", booking });
  } catch (error) {
    next(error);
  }
};

// Vendor: get all booking requests for their services
export const getVendorBookings = async (req, res, next) => {
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

    const bookings = await prisma.booking.findMany({
      where: {
        eventService: {
          servicePackage: {
            vendorService: { vendorId: vendor.id },
          },
        },
      },
      include: {
        eventService: {
          include: {
            event: true,
            servicePackage: { include: { vendorService: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ status: "ok", count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// Vendor: accept or reject a booking
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["ACCEPTED", "REJECTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        eventService: {
          include: {
            servicePackage: { include: { vendorService: true } },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    // Ownership check: this booking must belong to this vendor
    if (booking.eventService.servicePackage.vendorService.vendorId !== vendor.id) {
      return res.status(403).json({
        status: "error",
        message: "You do not have access to this booking",
      });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ status: "ok", booking: updated });
  } catch (error) {
    next(error);
  }
};
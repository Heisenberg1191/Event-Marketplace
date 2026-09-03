import prisma from "../config/prisma.js";

// Customer creates a new event
export const createEvent = async (req, res, next) => {
  try {
    const { name, eventType, eventDate, location, guestCount, budget, description } =
      req.body;

    if (!name || !eventType || !eventDate || !location || !budget) {
      return res.status(400).json({
        status: "error",
        message:
          "Name, event type, date, location, and budget are required",
      });
    }

    const event = await prisma.event.create({
      data: {
        customerId: req.user.id,
        name,
        eventType,
        eventDate: new Date(eventDate),
        location,
        guestCount: guestCount ? parseInt(guestCount) : null,
        budget: parseFloat(budget),
        description: description || null,
      },
    });

    res.status(201).json({ status: "ok", event });
  } catch (error) {
    next(error);
  }
};

// Get all events belonging to the logged-in customer
export const getMyEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      where: { customerId: req.user.id },
      orderBy: { eventDate: "asc" },
    });

    res.json({ status: "ok", count: events.length, events });
  } catch (error) {
    next(error);
  }
};

// Get a single event (only if it belongs to the logged-in customer)
export const getEventById = async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        eventServices: {
          include: {
            servicePackage: {
              include: {
                vendorService: { include: { vendor: true } },
              },
            },
            booking: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    if (event.customerId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "You do not have access to this event",
      });
    }

    res.json({ status: "ok", event });
  } catch (error) {
    next(error);
  }
};

// Update an event
export const updateEvent = async (req, res, next) => {
  try {
    const existing = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    if (existing.customerId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "You do not have access to this event",
      });
    }

    const { name, eventType, eventDate, location, guestCount, budget, description } =
      req.body;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(eventType && { eventType }),
        ...(eventDate && { eventDate: new Date(eventDate) }),
        ...(location && { location }),
        ...(guestCount !== undefined && { guestCount: parseInt(guestCount) }),
        ...(budget !== undefined && { budget: parseFloat(budget) }),
        ...(description !== undefined && { description }),
      },
    });

    res.json({ status: "ok", event });
  } catch (error) {
    next(error);
  }
};

// Delete an event
export const deleteEvent = async (req, res, next) => {
  try {
    const existing = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    if (existing.customerId !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "You do not have access to this event",
      });
    }

    await prisma.event.delete({ where: { id: req.params.id } });

    res.json({ status: "ok", message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};
// routes/calendarRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Assuming you have auth middleware

// ✅ Temporary in-memory storage for events (replace with database later)
let temporaryEvents = {};

/**
 * @swagger
 * /calendar/farmer/{farmerId}:
 *   get:
 *     summary: Get calendar events for a farmer
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: farmerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The farmer's ID
 *     responses:
 *       200:
 *         description: Calendar events retrieved successfully
 */
router.get("/farmer/:farmerId", auth, async (req, res) => {
  try {
    const { farmerId } = req.params;

    console.log(`📅 Fetching events for farmer: ${farmerId}`);

    // Get sample events
    // ✅ Get user-created events for this farmer
    const userEvents = temporaryEvents[farmerId] || [];

    // ✅ Combine sample events with user-created events
    const allEvents = [...userEvents]; // Only user-created events

    console.log(
      `📊 Returning ${allEvents.length} events (${userEvents.length} user-created)`
    );

    res.json(allEvents);
  } catch (error) {
    console.error("❌ Error fetching calendar events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /calendar/events:
 *   post:
 *     summary: Create a new calendar event
 *     tags: [Calendar]
 *     security:
 *       - bearerAuth: []
 */
router.post("/events", auth, async (req, res) => {
  try {
    const { title, type, start, end, description } = req.body;

    // ✅ Debug: Check what's in req.user
    console.log("🔐 Auth user data:", req.user);

    // ✅ Fix: Use req.user.id instead of req.user._id
    const farmerId = req.user?.id || req.user?._id;

    console.log("📝 Creating new event:", {
      title,
      type,
      start,
      end,
      farmerId,
    });

    // ✅ Better validation
    if (!farmerId) {
      return res.status(401).json({
        message: "Authentication required - no user ID found",
      });
    }

    // Validate required fields
    if (!title || !type || !start || !end) {
      return res.status(400).json({
        message: "Missing required fields: title, type, start, end",
      });
    }

    // ✅ Create new event with unique ID
    const newEvent = {
      _id: `user-${Date.now()}`, // Unique ID with prefix
      title,
      type,
      start,
      end,
      description,
      farmerId,
      createdAt: new Date().toISOString(),
    };

    // ✅ Store in temporary storage (organized by farmerId)
    if (!temporaryEvents[farmerId]) {
      temporaryEvents[farmerId] = [];
    }
    temporaryEvents[farmerId].push(newEvent);

    console.log("✅ Event stored successfully:", newEvent);
    console.log(
      `📊 Farmer ${farmerId} now has ${temporaryEvents[farmerId].length} custom events`
    );

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ Error creating calendar event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Debug route to see stored events
router.get("/debug/events", auth, async (req, res) => {
  try {
    const farmerId = req.user._id;
    const userEvents = temporaryEvents[farmerId] || [];

    res.json({
      farmerId,
      eventCount: userEvents.length,
      events: userEvents,
      allStoredData: temporaryEvents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /calendar/events/{eventId}:
 *   put:
 *     summary: Update a calendar event
 *     tags: [Calendar]
 */
router.put("/events/:eventId", auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    const farmerId = req.user?.id || req.user?._id;

    if (!farmerId) {
      return res.status(401).json({ message: "Authentication required - no user ID found" });
    }

    if (!temporaryEvents[farmerId]) {
      return res.status(404).json({ message: "No events found for this farmer." });
    }

    let eventFound = false;
    temporaryEvents[farmerId] = temporaryEvents[farmerId].map((event) => {
      if (event._id === eventId) {
        eventFound = true;
        return { ...event, ...updates };
      }
      return event;
    });

    if (!eventFound) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({
      message: "Event updated successfully",
      eventId,
      updates,
    });
  } catch (error) {
    console.error("Error updating calendar event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /calendar/events/{eventId}:
 *   delete:
 *     summary: Delete a calendar event
 *     tags: [Calendar]
 */
router.delete("/events/:eventId", auth, async (req, res) => {
  try {
    const { eventId } = req.params;
    const farmerId = req.user?.id || req.user?._id;

    if (!farmerId) {
      return res.status(401).json({ message: "Authentication required - no user ID found" });
    }

    // If it's a sample event, just return success without trying to delete from temporary storage
    if (eventId.startsWith("sample-")) {
      console.log(`Attempted to delete sample event: ${eventId}. Returning success.`);
      return res.json({
        message: "Sample event 'deleted' successfully (not actually removed from server).",
        eventId,
      });
    }

    if (!temporaryEvents[farmerId]) {
      return res.status(404).json({ message: "No events found for this farmer." });
    }

    const initialLength = temporaryEvents[farmerId].length;
    temporaryEvents[farmerId] = temporaryEvents[farmerId].filter(
      (event) => event._id !== eventId
    );

    if (temporaryEvents[farmerId].length === initialLength) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({
      message: "Event deleted successfully",
      eventId,
    });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

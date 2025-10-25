const { Router } = require('express');
const { Ticket, Comment } = require('./db');
const {
  TicketCreateSchema,
  TicketUpdateSchema,
  CommentCreateSchema,
  TicketQuerySchema,
} = require('./validators');
const { z } = require('zod');

const router = Router();

// Helper function for validation errors
const handleValidationError = (error, res) => {
  return res.status(422).json({
    error: 'Validation failed',
    issues: error.issues.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    })),
  });
};

// ===== TICKET ROUTES =====

// GET /api/tickets - List tickets with optional filters
router.get('/tickets', async (req, res) => {
  try {
    const query = TicketQuerySchema.parse(req.query);

    const filter = {};

    // Add status filter if provided
    if (query.status) {
      filter.status = query.status;
    }

    // Add search filter if provided
    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filter).sort({ updatedAt: -1 });
    const total = await Ticket.countDocuments(filter);

    res.json({ items: tickets, total });
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(error, res);
      return;
    }
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET /api/tickets/:id - Get single ticket
router.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// POST /api/tickets - Create new ticket
router.post('/tickets', async (req, res) => {
  try {
    const data = TicketCreateSchema.parse(req.body);

    const ticket = new Ticket({
      ...data,
      status: 'OPEN',
    });

    await ticket.save();

    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(error, res);
      return;
    }
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PATCH /api/tickets/:id - Update ticket
router.patch('/tickets/:id', async (req, res) => {
  try {
    const data = TicketUpdateSchema.parse(req.body);

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(error, res);
      return;
    }
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// DELETE /api/tickets/:id - Delete ticket
router.delete('/tickets/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Delete associated comments
    await Comment.deleteMany({ ticketId: req.params.id });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// ===== COMMENT ROUTES =====

// GET /api/tickets/:id/comments - List comments for a ticket
router.get('/tickets/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ ticketId: req.params.id }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/tickets/:id/comments - Add comment to ticket
router.post('/tickets/:id/comments', async (req, res) => {
  try {
    // First check if ticket exists
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    const data = CommentCreateSchema.parse(req.body);

    const comment = new Comment({
      ...data,
      ticketId: req.params.id,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(error, res);
      return;
    }
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;

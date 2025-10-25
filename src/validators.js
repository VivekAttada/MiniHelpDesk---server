const { z } = require('zod');

// Enums
const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']);

// Ticket Validators
const TicketCreateSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: PriorityEnum.default('MEDIUM'),
  reporter: z.string().min(2, 'Reporter name must be at least 2 characters'),
});

const TicketUpdateSchema = z.object({
  title: z.string().min(4).max(100).optional(),
  description: z.string().min(10).optional(),
  priority: PriorityEnum.optional(),
  status: StatusEnum.optional(),
  reporter: z.string().min(2).optional(),
});

// Comment Validators
const CommentCreateSchema = z.object({
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  body: z.string().min(2, 'Comment must be at least 2 characters').max(500, 'Comment must not exceed 500 characters'),
});

// Query Validators
const TicketQuerySchema = z.object({
  q: z.string().optional(),
  status: StatusEnum.optional(),
});

module.exports = {
  PriorityEnum,
  StatusEnum,
  TicketCreateSchema,
  TicketUpdateSchema,
  CommentCreateSchema,
  TicketQuerySchema,
};

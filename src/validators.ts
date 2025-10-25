import { z } from 'zod';

// Enums
export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const StatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']);

// Ticket Validators
export const TicketCreateSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: PriorityEnum.default('MEDIUM'),
  reporter: z.string().min(2, 'Reporter name must be at least 2 characters'),
});

export const TicketUpdateSchema = z.object({
  title: z.string().min(4).max(100).optional(),
  description: z.string().min(10).optional(),
  priority: PriorityEnum.optional(),
  status: StatusEnum.optional(),
  reporter: z.string().min(2).optional(),
});

// Comment Validators
export const CommentCreateSchema = z.object({
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  body: z.string().min(2, 'Comment must be at least 2 characters').max(500, 'Comment must not exceed 500 characters'),
});

// Query Validators
export const TicketQuerySchema = z.object({
  q: z.string().optional(),
  status: StatusEnum.optional(),
});

// Types
export type TicketCreate = z.infer<typeof TicketCreateSchema>;
export type TicketUpdate = z.infer<typeof TicketUpdateSchema>;
export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type TicketQuery = z.infer<typeof TicketQuerySchema>;

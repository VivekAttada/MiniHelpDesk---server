import mongoose from 'mongoose';

const { Schema } = mongoose;

// Enums
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

// Comment Schema
const commentSchema = new Schema(
  {
    author: { type: String, required: true },
    body: { type: String, required: true },
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Ticket Schema
const ticketSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.OPEN,
      required: true,
    },
    reporter: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Models
export const Ticket = mongoose.model('Ticket', ticketSchema);
export const Comment = mongoose.model('Comment', commentSchema);

// Connect to MongoDB
export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Disconnect from MongoDB
export async function disconnectDB() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

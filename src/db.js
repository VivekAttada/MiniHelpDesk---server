const mongoose = require('mongoose');

const { Schema } = mongoose;

// Enums
const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

const Status = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  CLOSED: 'CLOSED',
};

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
const Ticket = mongoose.model('Ticket', ticketSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Connect to MongoDB
async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Disconnect from MongoDB
async function disconnectDB() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

module.exports = {
  Priority,
  Status,
  Ticket,
  Comment,
  connectDB,
  disconnectDB,
};

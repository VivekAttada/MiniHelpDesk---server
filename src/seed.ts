import dotenv from 'dotenv';
import { connectDB, disconnectDB, Ticket, Comment } from './db';

dotenv.config();

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    console.log('  Cleared existing data');

    // Create sample tickets
    const tickets = await Ticket.create([
      {
        title: 'Printer not working on 2nd floor',
        description: 'The HP printer in the 2nd floor office is showing an error message and not printing. Need urgent help.',
        priority: 'HIGH',
        status: 'OPEN',
        reporter: 'Maya Johnson',
      },
      {
        title: 'Login issues with company portal',
        description: 'Multiple users reporting they cannot log in to the company portal. Getting "Invalid credentials" error even with correct password.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        reporter: 'Sam Chen',
      },
      {
        title: 'Request for new mouse',
        description: 'My current mouse is not working properly. The left click is intermittent. Would like to request a replacement.',
        priority: 'LOW',
        status: 'OPEN',
        reporter: 'Alex Rivera',
      },
      {
        title: 'Slow internet connection',
        description: 'Internet speed has been very slow in the conference room for the past week. This is affecting our video calls.',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        reporter: 'Jordan Lee',
      },
      {
        title: 'Software installation request',
        description: 'Need Adobe Creative Suite installed on my workstation for the new design project.',
        priority: 'MEDIUM',
        status: 'CLOSED',
        reporter: 'Taylor Kim',
      },
      {
        title: 'Email not syncing on mobile',
        description: 'Company email is not syncing on my iPhone. Last sync was 3 days ago.',
        priority: 'MEDIUM',
        status: 'OPEN',
        reporter: 'Chris Anderson',
      },
    ]);

    console.log(`  ✅ Created ${tickets.length} tickets`);

    // Create sample comments for some tickets
    const comments = await Comment.create([
      {
        author: 'Tech Support',
        body: 'We are looking into this issue. Will send someone to check the printer.',
        ticketId: tickets[0]?._id,
      },
      {
        author: 'IT Admin',
        body: 'We have identified the issue with the authentication server. Working on a fix now.',
        ticketId: tickets[1]?._id,
      },
      {
        author: 'Sam Chen',
        body: 'This is affecting about 15 users currently. High priority.',
        ticketId: tickets[1]?._id,
      },
      {
        author: 'Jordan Lee',
        body: 'Checked the router settings. Speed test shows 10 Mbps when it should be 100 Mbps.',
        ticketId: tickets[3]?._id,
      },
      {
        author: 'IT Support',
        body: 'Software has been installed and tested. Closing this ticket.',
        ticketId: tickets[4]?._id,
      },
      {
        author: 'Taylor Kim',
        body: 'Thanks! Everything is working great.',
        ticketId: tickets[4]?._id,
      },
    ]);

    console.log(`  ✅ Created ${comments.length} comments`);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

const run = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-helpdesk';
  await connectDB(uri);
  await seedData();
  await disconnectDB();
};

run();

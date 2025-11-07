const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking PrepForge Database...\n');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`👤 Users: ${userCount}`);

    // Count AI interviews
    const aiInterviewCount = await prisma.aIInterview.count();
    console.log(`🤖 AI Interviews: ${aiInterviewCount}`);

    // Count live interviews
    const liveInterviewCount = await prisma.liveInterview.count();
    console.log(`👥 Live Interviews: ${liveInterviewCount}`);

    // Count payments
    const paymentCount = await prisma.payment.count();
    console.log(`💳 Payments: ${paymentCount}`);

    // Count questions
    const questionCount = await prisma.question.count();
    console.log(`❓ Questions: ${questionCount}`);

    // Count responses
    const responseCount = await prisma.response.count();
    console.log(`💬 Responses: ${responseCount}`);

    // Count achievements
    const achievementCount = await prisma.achievement.count();
    console.log(`🏆 Achievements: ${achievementCount}`);

    console.log('\n📊 Database Summary:');
    console.log('━'.repeat(50));
    
    if (userCount > 0) {
      console.log('\n👥 Users:');
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          subscription: true,
          createdAt: true,
        },
        take: 5,
      });
      console.table(users);
    } else {
      console.log('\n⚠️  No users found. Database is empty.');
      console.log('💡 Tip: Register a user through the app or create seed data.');
    }

    if (aiInterviewCount > 0) {
      console.log('\n🤖 Recent AI Interviews:');
      const aiInterviews = await prisma.aIInterview.findMany({
        select: {
          id: true,
          interviewType: true,
          topic: true,
          difficulty: true,
          status: true,
          score: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      console.table(aiInterviews);
    }

    if (liveInterviewCount > 0) {
      console.log('\n👥 Recent Live Interviews:');
      const liveInterviews = await prisma.liveInterview.findMany({
        select: {
          id: true,
          interviewType: true,
          topic: true,
          status: true,
          scheduledAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      console.table(liveInterviews);
    }

    console.log('\n✅ Database check complete!\n');

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

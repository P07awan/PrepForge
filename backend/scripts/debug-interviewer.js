const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugInterviewer() {
  try {
    console.log('\n=== DEBUGGING INTERVIEWER DASHBOARD ===\n');

    // Find Rachit
    const rachit = await prisma.user.findUnique({
      where: { email: 'rachit@gmail.com' }
    });

    if (!rachit) {
      console.log('❌ ERROR: User rachit@gmail.com not found!');
      console.log('Available users:');
      const users = await prisma.user.findMany({ select: { email: true, role: true } });
      users.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      return;
    }

    console.log('✅ User found:');
    console.log(`   Email: ${rachit.email}`);
    console.log(`   Name: ${rachit.firstName} ${rachit.lastName}`);
    console.log(`   Role: ${rachit.role}`);
    console.log(`   ID: ${rachit.id}\n`);

    // Query exactly as dashboard does
    const interviewerInterviews = await prisma.liveInterview.findMany({
      where: {
        interviewerId: rachit.id,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    console.log(`📊 Dashboard Query Result: ${interviewerInterviews.length} interviews\n`);

    if (interviewerInterviews.length > 0) {
      console.log('✅ INTERVIEWS FOUND FOR DASHBOARD:\n');
      interviewerInterviews.forEach((interview, i) => {
        console.log(`${i + 1}. ${interview.topic}`);
        console.log(`   Status: ${interview.status}`);
        console.log(`   Scheduled: ${interview.scheduledAt.toLocaleString()}`);
        console.log(`   Candidate: ${interview.candidate.firstName} ${interview.candidate.lastName}`);
        console.log(`   Duration: ${interview.duration} minutes`);
        console.log('');
      });

      console.log('✅ SOLUTION: These interviews SHOULD appear on the dashboard.');
      console.log('\nIf they are NOT appearing, the issue is:');
      console.log('1. Frontend is not logged in with the correct user');
      console.log('2. Token in localStorage has wrong user ID');
      console.log('3. Frontend API call is failing\n');
      
      console.log('🔧 FIX:');
      console.log('1. Open browser DevTools (F12)');
      console.log('2. Go to Console tab');
      console.log('3. Run: localStorage.clear()');
      console.log('4. Refresh page and login again with rachit@gmail.com');
      console.log('5. Go to Dashboard\n');

    } else {
      console.log('❌ NO INTERVIEWS FOUND!\n');
      
      // Check all interviews
      console.log('Checking ALL interviews in database:\n');
      const allInterviews = await prisma.liveInterview.findMany({
        select: {
          topic: true,
          interviewerId: true,
          status: true,
          scheduledAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      console.log(`Total interviews in DB: ${allInterviews.length}\n`);
      
      allInterviews.forEach((interview, i) => {
        const isRachit = interview.interviewerId === rachit.id;
        const isScheduled = ['SCHEDULED', 'IN_PROGRESS'].includes(interview.status);
        console.log(`${i + 1}. ${interview.topic}`);
        console.log(`   InterviewerId: ${interview.interviewerId ? interview.interviewerId.substring(0, 8) + '...' : 'NULL'}`);
        console.log(`   Matches Rachit: ${isRachit ? '✅ YES' : '❌ NO'}`);
        console.log(`   Status: ${interview.status} (${isScheduled ? '✅ OK' : '❌ EXCLUDED'})`);
        console.log('');
      });

      if (allInterviews.some(i => i.interviewerId === null)) {
        console.log('⚠️  WARNING: Some interviews have NULL interviewerId!');
        console.log('This means they were created without an interviewer.\n');
      }
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

debugInterviewer();

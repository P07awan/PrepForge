const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLiveInterviews() {
  try {
    const interviews = await prisma.liveInterview.findMany({
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        interviewer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('\n📊 LIVE INTERVIEWS IN DATABASE\n');
    console.log('Total Count:', interviews.length);
    console.log('='.repeat(60));

    if (interviews.length === 0) {
      console.log('\n❌ No live interviews found in database.');
      console.log('   Try scheduling one from the frontend!\n');
    } else {
      interviews.forEach((interview, index) => {
        console.log(`\n${index + 1}. Interview ID: ${interview.id}`);
        console.log(`   Topic: ${interview.topic}`);
        console.log(`   Type: ${interview.interviewType}`);
        console.log(`   Status: ${interview.status}`);
        console.log(`   Scheduled: ${interview.scheduledAt}`);
        console.log(`   Duration: ${interview.duration} minutes`);
        console.log(`   Room ID: ${interview.roomId}`);
        console.log(`   Candidate: ${interview.candidate.firstName} ${interview.candidate.lastName} (${interview.candidate.email})`);
        if (interview.interviewer) {
          console.log(`   Interviewer: ${interview.interviewer.firstName} ${interview.interviewer.lastName} (${interview.interviewer.email})`);
        } else {
          console.log(`   Interviewer: Not assigned yet`);
        }
        console.log(`   Created: ${interview.createdAt}`);
      });
      console.log('\n' + '='.repeat(60));
      console.log('✅ Data is being saved to PostgreSQL database!\n');
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLiveInterviews();

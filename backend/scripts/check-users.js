const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      take: 10,
    });

    console.log('\n=== EXISTING USERS FOR TESTING ===\n');
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('📝 You need to register at least 2 users for testing:\n');
      console.log('1. Candidate user (to schedule interview)');
      console.log('2. Interviewer user (to receive notification)\n');
      console.log('Visit: http://localhost:5173/register\n');
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}\n`);
      });
      
      console.log('📋 TESTING INSTRUCTIONS:\n');
      console.log('To test email notifications:');
      console.log('1. Login as one user (candidate)');
      console.log('2. Go to "Live Interview" page');
      console.log('3. Enter another user\'s email as "Interviewer Email"');
      console.log('4. Schedule the interview');
      console.log('5. Check backend terminal for email notification logs\n');
    }
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bouclier';

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Connected to MongoDB');
    
    // Check all users
    const users = await User.find({});
    
    console.log(`\nTotal users found: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 You need to register users first before testing login.');
      console.log('\nTo create a test user:');
      console.log('1. Start your backend server: npm run dev');
      console.log('2. POST to /api/register with email and password');
    } else {
      console.log('\n📋 Current users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Building ID: ${user.buildingId || '❌ Not assigned'}`);
        console.log(`   Name: ${user.name || 'Not provided'}`);
        console.log('---');
      });
    }
    
    // Check for users without building assignments
    const usersWithoutBuilding = users.filter(user => !user.buildingId);
    if (usersWithoutBuilding.length > 0) {
      console.log(`\n⚠️  ${usersWithoutBuilding.length} users without building assignments:`);
      usersWithoutBuilding.forEach(user => {
        console.log(`   - ${user.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Database check completed');
  }
}

// Run the check
checkUsers();

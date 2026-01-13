require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing Database Connection...\n');

if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not defined in .env file');
  console.log('\nMake sure you have a .env file in the /backend directory with:');
  console.log('MONGO_URI=your_mongodb_connection_string');
  process.exit(1);
}

console.log('✅ MONGO_URI found in .env');
console.log('🔗 Connecting to MongoDB...\n');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Successfully connected to MongoDB!');
  console.log(`📍 Host: ${mongoose.connection.host}`);
  console.log(`📊 Database: ${mongoose.connection.name}`);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Failed to connect to MongoDB:');
  console.error(`   ${error.message}\n`);
  console.log('💡 Troubleshooting tips:');
  console.log('   1. Check if your MongoDB connection string is correct');
  console.log('   2. If using MongoDB Atlas, make sure your IP is whitelisted');
  console.log('   3. If using local MongoDB, make sure it\'s running');
  console.log('   4. Check your internet connection');
  process.exit(1);
});

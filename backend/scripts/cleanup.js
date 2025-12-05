const mongoose = require('mongoose');
const Building = require('../api/buildings');
const Block = require('../models/Block');
const Apartment = require('../models/Apartment');

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/';

async function cleanupCollections() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all apartments except the last one
    console.log('🗑️ Deleting apartments except the last one...');
    const lastApartment = await Apartment.findOne().sort({ _id: -1 });
    if (lastApartment) {
      console.log(`Keeping last apartment: ${lastApartment._id} - ${lastApartment.apartmentNumber}`);
      const apartmentResult = await Apartment.deleteMany({ _id: { $ne: lastApartment._id } });
      console.log(`✅ Deleted ${apartmentResult.deletedCount} apartments`);
    } else {
      console.log('No apartments found');
    }

    // Delete all blocks
    console.log('🗑️ Deleting blocks...');
    const blockResult = await Block.deleteMany({});
    console.log(`✅ Deleted ${blockResult.deletedCount} blocks`);

    // Delete all buildings
    console.log('🗑️ Deleting buildings...');
    const buildingResult = await Building.deleteMany({});
    console.log(`✅ Deleted ${buildingResult.deletedCount} buildings`);

    console.log('🎉 Cleanup completed successfully!');
    console.log({
      apartments: apartmentResult.deletedCount,
      blocks: blockResult.deletedCount,
      buildings: buildingResult.deletedCount
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupCollections();
}

module.exports = { cleanupCollections };

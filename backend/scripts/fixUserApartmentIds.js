const mongoose = require('mongoose');
const User = require('../models/User');
const Apartment = require('../models/Apartment');

async function fixUserApartmentIds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    console.log('Connected to MongoDB');

    // Find all users with appartementId
    const users = await User.find({ appartementId: { $exists: true, $ne: null } });

    console.log(`Found ${users.length} users with appartementId`);

    let fixedCount = 0;
    let invalidCount = 0;

    for (const user of users) {
      const appartementId = user.appartementId;

      // Check if it's already an ObjectId
      if (mongoose.Types.ObjectId.isValid(appartementId)) {
        // Verify the apartment exists
        const apartment = await Apartment.findById(appartementId);
        if (apartment) {
          console.log(`User ${user.email}: appartementId ${appartementId} is valid`);
        } else {
          console.log(`User ${user.email}: appartementId ${appartementId} does not exist in apartments collection`);
          // Remove invalid appartementId
          await User.findByIdAndUpdate(user._id, { $unset: { appartementId: 1 } });
          invalidCount++;
        }
      } else {
        // It's a string, try to find apartment by apartmentNumber
        console.log(`User ${user.email}: appartementId ${appartementId} is not an ObjectId, searching by number...`);

        const apartment = await Apartment.findOne({ apartmentNumber: appartementId });
        if (apartment) {
          console.log(`Found matching apartment ${apartment._id} for number ${appartementId}`);
          await User.findByIdAndUpdate(user._id, { appartementId: apartment._id });
          fixedCount++;
        } else {
          console.log(`No apartment found for number ${appartementId}, removing appartementId`);
          await User.findByIdAndUpdate(user._id, { $unset: { appartementId: 1 } });
          invalidCount++;
        }
      }
    }

    console.log(`Migration complete: ${fixedCount} fixed, ${invalidCount} removed invalid appartementIds`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
fixUserApartmentIds();

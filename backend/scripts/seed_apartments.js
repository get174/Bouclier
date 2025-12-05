const mongoose = require('mongoose');
const Apartment = require('../models/Apartment');

async function seedApartments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    const apartments = [
      {
        _id: '689485b022a0680db61674fe',
        apartmentNumber: 'C-014',
        blockId: '6894245dd2742852f754762f',
        floor: 4,
        description: 'Appartement avec salle de cinéma privée'
      },
      // Add more apartments as needed
    ];

    for (const apt of apartments) {
      const existing = await Apartment.findById(apt._id);
      if (!existing) {
        const newApt = new Apartment(apt);
        await newApt.save();
        console.log(`Inserted apartment ${apt.apartmentNumber}`);
      } else {
        console.log(`Apartment ${apt.apartmentNumber} already exists`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedApartments();

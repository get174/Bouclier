const mongoose = require('mongoose');
const buildings = require('./api/buildings');

async function seedBuildings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    const newBuildings = [
      {
        _id: '68941d6d412f357010cdf58e',
        responsibleName: 'Marie Dupont',
        contactNumber: '+243812345678',
        responsibleFunction: 'Directeur',
        buildingName: 'Résidence Lumière',
        commune: 'Gombe'
      },
      {
        _id: '68941d6d412f357010cdf58f',
        responsibleName: 'Jean Kabongo',
        contactNumber: '+243812345679',
        responsibleFunction: 'Gérant',
        buildingName: 'Immeuble Horizon',
        commune: 'Ngaliema'
      },
      {
        _id: '68941d6d412f357010cdf590',
        responsibleName: 'Sophie Mbeki',
        contactNumber: '+243812345680',
        responsibleFunction: 'Administrateur',
        buildingName: 'Complexe Azur',
        commune: 'Kintambo'
      }
    ];

    for (const building of newBuildings) {
      const existing = await buildings.findById(building._id);
      if (!existing) {
        const newBuilding = new buildings(building);
        await newBuilding.save();
        console.log(`Inserted building ${building.buildingName}`);
      } else {
        console.log(`Building ${building.buildingName} already exists`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedBuildings();

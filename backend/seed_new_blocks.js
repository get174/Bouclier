const mongoose = require('mongoose');
const Block = require('./models/Block');

async function seedNewBlocks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    const newBlocks = [
      // Blocks for Résidence Lumière (68941d6d412f357010cdf58e)
      { _id: '6894245dd2742852f7547635', blockName: 'A', buildingId: '68941d6d412f357010cdf58e', description: 'Bloc A - Résidence Lumière' },
      { _id: '6894245dd2742852f7547636', blockName: 'B', buildingId: '68941d6d412f357010cdf58e', description: 'Bloc B - Résidence Lumière' },

      // Blocks for Immeuble Horizon (68941d6d412f357010cdf58f)
      { _id: '6894245dd2742852f7547637', blockName: 'A', buildingId: '68941d6d412f357010cdf58f', description: 'Bloc A - Immeuble Horizon' },
      { _id: '6894245dd2742852f7547638', blockName: 'B', buildingId: '68941d6d412f357010cdf58f', description: 'Bloc B - Immeuble Horizon' },

      // Blocks for Complexe Azur (68941d6d412f357010cdf590)
      { _id: '6894245dd2742852f7547639', blockName: 'A', buildingId: '68941d6d412f357010cdf590', description: 'Bloc A - Complexe Azur' },
      { _id: '6894245dd2742852f754763a', blockName: 'B', buildingId: '68941d6d412f357010cdf590', description: 'Bloc B - Complexe Azur' }
    ];

    for (const block of newBlocks) {
      const existing = await Block.findById(block._id);
      if (!existing) {
        const newBlock = new Block(block);
        await newBlock.save();
        console.log(`Inserted block ${block.blockName} for building ${block.buildingId}`);
      } else {
        console.log(`Block ${block.blockName} already exists`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedNewBlocks();

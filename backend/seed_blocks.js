const mongoose = require('mongoose');
const Block = require('./models/Block');

async function seedBlocks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    const blocks = [
      { _id: '6894245dd2742852f754762e', blockName: 'A-B', buildingId: '68941d6d412f357010cdf58d' },
      { _id: '6894245dd2742852f754762f', blockName: 'A-C', buildingId: '68941d6d412f357010cdf58d' },
      { _id: '6894245dd2742852f7547630', blockName: 'D', buildingId: '68941d6d412f357010cdf58d' },
      { _id: '6894245dd2742852f7547631', blockName: 'E', buildingId: '68941d6d412f357010cdf58d' },
      { _id: '6894245dd2742852f7547632', blockName: 'F', buildingId: '68941d6d412f357010cdf58d' },
      { _id: '6894245dd2742852f7547633', blockName: 'G', buildingId: '68941d6d412f357010cdf58d' },
    ];

    for (const block of blocks) {
      const existing = await Block.findById(block._id);
      if (!existing) {
        const newBlock = new Block(block);
        await newBlock.save();
        console.log(`Inserted block ${block.blockName}`);
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

seedBlocks();

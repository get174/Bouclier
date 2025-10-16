const Block = require('../models/Block');

// Create a new block
async function createBlock(blockData) {
  const block = new Block(blockData);
  return await block.save();
}

// Get all blocks for a specific building
async function getBlocksByBuildingId(buildingId) {
  return await Block.find({ buildingId: buildingId });
}

// Get a specific block by ID
async function getBlockById(blockId) {
  return await Block.findById(blockId);
}

// Update a block
async function updateBlock(blockId, updateData) {
  return await Block.findByIdAndUpdate(blockId, updateData, { new: true });
}

// Delete a block
async function deleteBlock(blockId) {
  return await Block.findByIdAndDelete(blockId);
}

module.exports = {
  createBlock,
  getBlocksByBuildingId,
  getBlockById,
  updateBlock,
  deleteBlock
};

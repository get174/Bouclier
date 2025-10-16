const mongoose = require('mongoose');
const Apartment = require('../models/Apartment');

const getApartmentsByBlockId = async (blockId) => {
  try {
    const apartments = await Apartment.find({ blockId: blockId });
    return apartments;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des appartements');
  }
};

module.exports = {
  getApartmentsByBlockId
};

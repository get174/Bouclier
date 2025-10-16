const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Visitor = require('../models/Visitor'); // Assurez-vous que le chemin est correct

// Remplacez par votre chaîne de connexion MongoDB Atlas
const dbUri = 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/';

const migrateVisitors = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log('✅ Connexion à MongoDB réussie pour la migration.');

    // Trouver tous les visiteurs auxquels il manque soit groupId, soit accessId
    const visitorsToUpdate = await Visitor.find({
      $or: [
        { groupId: { $exists: false } },
        { accessId: { $exists: false } }
      ]
    });

    if (visitorsToUpdate.length === 0) {
      console.log('✅ Aucun visiteur à mettre à jour. La base de données est déjà à jour.');
      return;
    }

    console.log(`🔍 ${visitorsToUpdate.length} visiteur(s) à mettre à jour...`);

    const operations = visitorsToUpdate.map(visitor => {
      const updatePayload = {};
      if (!visitor.groupId) {
        updatePayload.groupId = uuidv4();
      }
      if (!visitor.accessId) {
        updatePayload.accessId = uuidv4();
      }

      return {
        updateOne: {
          filter: { _id: visitor._id },
          update: { $set: updatePayload },
        },
      };
    });

    const result = await Visitor.bulkWrite(operations);

    console.log(`✅ Migration terminée avec succès. ${result.modifiedCount} visiteur(s) mis à jour.`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration des visiteurs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB.');
  }
};

migrateVisitors();

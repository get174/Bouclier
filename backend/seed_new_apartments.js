const mongoose = require('mongoose');
const Apartment = require('./models/Apartment');

async function seedNewApartments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/');

    const newApartments = [
      // Apartments for Résidence Lumière - Block A (6894245dd2742852f7547635)
      { _id: '689485b022a0680db6167514', apartmentNumber: 'A-001', blockId: '6894245dd2742852f7547635', floor: 1, description: 'Appartement moderne avec balcon' },
      { _id: '689485b022a0680db6167515', apartmentNumber: 'A-002', blockId: '6894245dd2742852f7547635', floor: 1, description: 'Appartement spacieux' },
      { _id: '689485b022a0680db6167516', apartmentNumber: 'A-003', blockId: '6894245dd2742852f7547635', floor: 2, description: 'Appartement avec vue' },
      { _id: '689485b022a0680db6167517', apartmentNumber: 'A-004', blockId: '6894245dd2742852f7547635', floor: 2, description: 'Appartement familial' },
      { _id: '689485b022a0680db6167518', apartmentNumber: 'A-005', blockId: '6894245dd2742852f7547635', floor: 3, description: 'Appartement premium' },
      { _id: '689485b022a0680db6167519', apartmentNumber: 'A-006', blockId: '6894245dd2742852f7547635', floor: 3, description: 'Appartement avec terrasse' },
      { _id: '689485b022a0680db616751a', apartmentNumber: 'A-007', blockId: '6894245dd2742852f7547635', floor: 4, description: 'Appartement duplex' },
      { _id: '689485b022a0680db616751b', apartmentNumber: 'A-008', blockId: '6894245dd2742852f7547635', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db616751c', apartmentNumber: 'A-009', blockId: '6894245dd2742852f7547635', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db616751d', apartmentNumber: 'A-010', blockId: '6894245dd2742852f7547635', floor: 5, description: 'Appartement de luxe' },

      // Apartments for Résidence Lumière - Block B (6894245dd2742852f7547636)
      { _id: '689485b022a0680db616751e', apartmentNumber: 'B-001', blockId: '6894245dd2742852f7547636', floor: 1, description: 'Appartement cosy' },
      { _id: '689485b022a0680db616751f', apartmentNumber: 'B-002', blockId: '6894245dd2742852f7547636', floor: 1, description: 'Appartement lumineux' },
      { _id: '689485b022a0680db6167520', apartmentNumber: 'B-003', blockId: '6894245dd2742852f7547636', floor: 2, description: 'Appartement avec jardin' },
      { _id: '689485b022a0680db6167521', apartmentNumber: 'B-004', blockId: '6894245dd2742852f7547636', floor: 2, description: 'Appartement traditionnel' },
      { _id: '689485b022a0680db6167522', apartmentNumber: 'B-005', blockId: '6894245dd2742852f7547636', floor: 3, description: 'Appartement moderne' },
      { _id: '689485b022a0680db6167523', apartmentNumber: 'B-006', blockId: '6894245dd2742852f7547636', floor: 3, description: 'Appartement avec parking' },
      { _id: '689485b022a0680db6167524', apartmentNumber: 'B-007', blockId: '6894245dd2742852f7547636', floor: 4, description: 'Appartement familial' },
      { _id: '689485b022a0680db6167525', apartmentNumber: 'B-008', blockId: '6894245dd2742852f7547636', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db6167526', apartmentNumber: 'B-009', blockId: '6894245dd2742852f7547636', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db6167527', apartmentNumber: 'B-010', blockId: '6894245dd2742852f7547636', floor: 5, description: 'Appartement de standing' },

      // Apartments for Immeuble Horizon - Block A (6894245dd2742852f7547637)
      { _id: '689485b022a0680db6167528', apartmentNumber: 'A-101', blockId: '6894245dd2742852f7547637', floor: 1, description: 'Appartement avec vue fleuve' },
      { _id: '689485b022a0680db6167529', apartmentNumber: 'A-102', blockId: '6894245dd2742852f7547637', floor: 1, description: 'Appartement spacieux' },
      { _id: '689485b022a0680db616752a', apartmentNumber: 'A-201', blockId: '6894245dd2742852f7547637', floor: 2, description: 'Appartement moderne' },
      { _id: '689485b022a0680db616752b', apartmentNumber: 'A-202', blockId: '6894245dd2742852f7547637', floor: 2, description: 'Appartement cosy' },
      { _id: '689485b022a0680db616752c', apartmentNumber: 'A-301', blockId: '6894245dd2742852f7547637', floor: 3, description: 'Appartement premium' },
      { _id: '689485b022a0680db616752d', apartmentNumber: 'A-302', blockId: '6894245dd2742852f7547637', floor: 3, description: 'Appartement avec balcon' },
      { _id: '689485b022a0680db616752e', apartmentNumber: 'A-401', blockId: '6894245dd2742852f7547637', floor: 4, description: 'Appartement duplex' },
      { _id: '689485b022a0680db616752f', apartmentNumber: 'A-402', blockId: '6894245dd2742852f7547637', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db6167530', apartmentNumber: 'A-501', blockId: '6894245dd2742852f7547637', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db6167531', apartmentNumber: 'A-502', blockId: '6894245dd2742852f7547637', floor: 5, description: 'Appartement de luxe' },

      // Apartments for Immeuble Horizon - Block B (6894245dd2742852f7547638)
      { _id: '689485b022a0680db6167532', apartmentNumber: 'B-101', blockId: '6894245dd2742852f7547638', floor: 1, description: 'Appartement avec jardin privé' },
      { _id: '689485b022a0680db6167533', apartmentNumber: 'B-102', blockId: '6894245dd2742852f7547638', floor: 1, description: 'Appartement lumineux' },
      { _id: '689485b022a0680db6167534', apartmentNumber: 'B-201', blockId: '6894245dd2742852f7547638', floor: 2, description: 'Appartement traditionnel' },
      { _id: '689485b022a0680db6167535', apartmentNumber: 'B-202', blockId: '6894245dd2742852f7547638', floor: 2, description: 'Appartement moderne' },
      { _id: '689485b022a0680db6167536', apartmentNumber: 'B-301', blockId: '6894245dd2742852f7547638', floor: 3, description: 'Appartement avec terrasse' },
      { _id: '689485b022a0680db6167537', apartmentNumber: 'B-302', blockId: '6894245dd2742852f7547638', floor: 3, description: 'Appartement familial' },
      { _id: '689485b022a0680db6167538', apartmentNumber: 'B-401', blockId: '6894245dd2742852f7547638', floor: 4, description: 'Appartement premium' },
      { _id: '689485b022a0680db6167539', apartmentNumber: 'B-402', blockId: '6894245dd2742852f7547638', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db616753a', apartmentNumber: 'B-501', blockId: '6894245dd2742852f7547638', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db616753b', apartmentNumber: 'B-502', blockId: '6894245dd2742852f7547638', floor: 5, description: 'Appartement de standing' },

      // Apartments for Complexe Azur - Block A (6894245dd2742852f7547639)
      { _id: '689485b022a0680db616753c', apartmentNumber: 'A-001', blockId: '6894245dd2742852f7547639', floor: 1, description: 'Appartement moderne design' },
      { _id: '689485b022a0680db616753d', apartmentNumber: 'A-002', blockId: '6894245dd2742852f7547639', floor: 1, description: 'Appartement spacieux' },
      { _id: '689485b022a0680db616753e', apartmentNumber: 'A-003', blockId: '6894245dd2742852f7547639', floor: 2, description: 'Appartement avec vue panoramique' },
      { _id: '689485b022a0680db616753f', apartmentNumber: 'A-004', blockId: '6894245dd2742852f7547639', floor: 2, description: 'Appartement cosy' },
      { _id: '689485b022a0680db6167540', apartmentNumber: 'A-005', blockId: '6894245dd2742852f7547639', floor: 3, description: 'Appartement premium' },
      { _id: '689485b022a0680db6167541', apartmentNumber: 'A-006', blockId: '6894245dd2742852f7547639', floor: 3, description: 'Appartement avec balcon' },
      { _id: '689485b022a0680db6167542', apartmentNumber: 'A-007', blockId: '6894245dd2742852f7547639', floor: 4, description: 'Appartement duplex' },
      { _id: '689485b022a0680db6167543', apartmentNumber: 'A-008', blockId: '6894245dd2742852f7547639', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db6167544', apartmentNumber: 'A-009', blockId: '6894245dd2742852f7547639', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db6167545', apartmentNumber: 'A-010', blockId: '6894245dd2742852f7547639', floor: 5, description: 'Appartement de luxe' },

      // Apartments for Complexe Azur - Block B (6894245dd2742852f754763a)
      { _id: '689485b022a0680db6167546', apartmentNumber: 'B-001', blockId: '6894245dd2742852f754763a', floor: 1, description: 'Appartement avec jardin' },
      { _id: '689485b022a0680db6167547', apartmentNumber: 'B-002', blockId: '6894245dd2742852f754763a', floor: 1, description: 'Appartement lumineux' },
      { _id: '689485b022a0680db6167548', apartmentNumber: 'B-003', blockId: '6894245dd2742852f754763a', floor: 2, description: 'Appartement traditionnel' },
      { _id: '689485b022a0680db6167549', apartmentNumber: 'B-004', blockId: '6894245dd2742852f754763a', floor: 2, description: 'Appartement moderne' },
      { _id: '689485b022a0680db616754a', apartmentNumber: 'B-005', blockId: '6894245dd2742852f754763a', floor: 3, description: 'Appartement avec terrasse' },
      { _id: '689485b022a0680db616754b', apartmentNumber: 'B-006', blockId: '6894245dd2742852f754763a', floor: 3, description: 'Appartement familial' },
      { _id: '689485b022a0680db616754c', apartmentNumber: 'B-007', blockId: '6894245dd2742852f754763a', floor: 4, description: 'Appartement premium' },
      { _id: '689485b022a0680db616754d', apartmentNumber: 'B-008', blockId: '6894245dd2742852f754763a', floor: 4, description: 'Appartement studio' },
      { _id: '689485b022a0680db616754e', apartmentNumber: 'B-009', blockId: '6894245dd2742852f754763a', floor: 5, description: 'Appartement penthouse' },
      { _id: '689485b022a0680db616754f', apartmentNumber: 'B-010', blockId: '6894245dd2742852f754763a', floor: 5, description: 'Appartement de standing' }
    ];

    for (const apt of newApartments) {
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

seedNewApartments();

import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import path from 'path';
import checkEmail from './routes/checkEmail.js';
import sendOtp from './routes/sendOtp.js';
import verifyOtp from './routes/verifyOtp.js';
import setPassword from './routes/setPassword.js';
import login from './routes/login.js';
import auth from './routes/auth.js';
import refreshToken from './routes/refreshToken.js';
import updateProfile from './routes/updateProfile.js';
import buildingsRouter from './routes/buildings.js';
import apartmentsRouter from './routes/apartments.js';
import blocksRouter from './routes/blocks.js';
import visitorsRoute from './routes/visitors.js';
import deliveriesRoute from './routes/deliveries.js';
import repairsRoute from './routes/repairs.js';
import paymentsRoute from './routes/payments.js';
import userBuildingRoute from './routes/userBuilding.js';
import notificationsRoute from './routes/notifications.js';
const app = express();

app.use(cors());

app.use('/uploads', express.static(path.join(path.dirname(new URL(import.meta.url).pathname), 'uploads')));

app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://gatetshibanda:sejtad-7qimse-joDmav@mytech.35fvapu.mongodb.net/')
  .then(() => {
    console.log('✅ Connexion réussie à MongoDB');
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion à MongoDB:', err);
  });

// Enregistrez tous les itinéraires
app.use('/api/checkEmail', checkEmail);
app.use('/api/sendOtp', sendOtp);
app.use('/api/verifyOtp', verifyOtp);
app.use('/api/setPassword', setPassword);
app.use('/api/login', login);
app.use('/api/auth', auth);
app.use('/api/refresh-token', refreshToken);
app.use('/api/update-profile', updateProfile);

// Les routes plus spécifiques d'abord, puis les routes génériques
app.use('/api/visitors', visitorsRoute);
app.use('/api/deliveries', deliveriesRoute);
app.use('/api/repairs', repairsRoute);
app.use('/api/payments', paymentsRoute);
app.use('/api/buildings', buildingsRouter);
app.use('/api/blocks', blocksRouter);
app.use('/api/user', userBuildingRoute);
app.use('/api/notifications', notificationsRoute);
app.use('/api', apartmentsRouter); // Route générique en dernier

// Démarrer le serveur après que tous les itinéraires sont enregistrés
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

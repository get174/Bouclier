const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');


router.post('/', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    console.log('Sending OTP for email:', email.toLowerCase().trim());
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const deleteResult = await Otp.deleteMany({ email: email.toLowerCase().trim() });
    console.log('Deleted old OTPs:', deleteResult.deletedCount);

    const otpDoc = new Otp({
    email: email.toLowerCase().trim(),
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
     });

     await otpDoc.save();
     console.log('OTP saved:', otp, 'expires at:', otpDoc.expiresAt);

    // configurer le transporteur email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gate.tshibanda@gmail.com',
        pass: 'anzzyopbazbuyhgo'
      }
    });

 await transporter.sendMail({
      from: 'Bouclier SARL ',
      to: user.email,
      subject: 'Votre OTP',
      text:  `Voici votre code de connexion: ${otp}`
    });
res.json({ success: true });
  } catch (err) {
    console.error(err);
	res.status(500).json({ success: false, message: "Erreur lors de l’envoi de l’OTP" });
  }
});


module.exports = router;


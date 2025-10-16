const express = require('express');
const router = express.Router();
const Otp = require('../models/Otp');

router.post('/', async (req, res) => {
  const { email, otp } = req.body;


  try {
    console.log('Verifying OTP for email:', email.toLowerCase().trim(), 'otp:', otp);
    const otpRecord = await Otp.findOne({ email: email.toLowerCase().trim(), otp,used:false})
    console.log('OTP record found:', otpRecord);
	if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      console.log('OTP invalid or expired');
      return res.status(401).json({ success: false, message: 'OTP invalide ou expiré' });
    }

    otpRecord.used = true;
    await otpRecord.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;

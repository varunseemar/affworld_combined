const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../schemas/user.schema');
const dotenv = require('dotenv');
dotenv.config();

const otpStore ={};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpAndLinkEmail = async(email, otp, token) =>{
  const resetLink = `http://localhost:5173/resetpassword/${token}`;
  const mailOptions ={
    from: '"App" <varunkumarseemarzingazinga@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <p>Dear User,</p>
      <p>You requested to reset your password. Below are the details:</p>
      <ul>
        <li><strong>OTP:</strong> ${otp}</li>
      </ul>
      <p>Alternatively, you can reset your password using the following link:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>The OTP and the link are valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>Your App Team</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

router.post('/forgotpassword', async(req, res) =>{
    const{ email } = req.body;
    const otp = crypto.randomInt(100000, 999999);
    otpStore[email] ={ otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    const token = jwt.sign({ email }, process.env.JWTOKEN,{ expiresIn: '10m'});
    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ error: 'User not found'});
        }
        await sendOtpAndLinkEmail(email, otp, token);
        res.status(200).json({ message: 'OTP and reset link sent to your email'});
    } 
    catch(error){
        res.status(500).json({ error: 'Failed to send OTP and reset link'});
    }
});

router.post('/verifyotp',(req, res) =>{
    const{ email, otp } = req.body;
    const storedOtp = otpStore[email];
    if(!storedOtp){
      return res.status(400).json({ error: 'No OTP found for this email'});
    }
    if(storedOtp.expiresAt < Date.now()){
      return res.status(400).json({ error: 'OTP has expired'});
    }
    if(storedOtp.otp.toString() !== otp.toString()){
      return res.status(400).json({ error: 'Invalid OTP'});
    }
    delete otpStore[email];
    res.status(200).json({ message: 'OTP verified successfully'});
});


router.post('/resetpassword', async(req, res) =>{
    const{ email, password, token } = req.body;
    try{
      let user;
      if(token){
        const decoded = jwt.verify(token, process.env.JWTOKEN);
        const userEmail = decoded.email;
        user = await User.findOne({ email: userEmail });
        if(!user){
          return res.status(404).json({ error: 'Invalid token or user not found' });
        }
      } 
      else if(email){
        user = await User.findOne({ email });
        if(!user){
          return res.status(404).json({ error: 'User not found' });
        }
      } 
      else{
        return res.status(400).json({ error: 'Either email or token is required' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password reset successfully' });
    } 
    catch(error){
      console.error('Error resetting password:', error);
      if(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'){
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      res.status(500).json({ error: 'Failed to reset password. Please try again' });
    }
});

router.post('/validatetoken', async(req, res) =>{
    const{ token } = req.body;
    try{
      const decoded = jwt.verify(token, process.env.JWTOKEN);
      res.status(200).json({ message: 'Valid token', email: decoded.email });
    } 
    catch(err){
      res.status(400).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;
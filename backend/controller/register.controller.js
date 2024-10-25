import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import nodemailer from "nodemailer";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  secureConnection : true,
  auth: {
    user: 'webproject2026@gmail.com',
    pass: 'ogws glsi ghgc ospm',
  },
});

// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create a 6-digit OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpires = Date.now() + 3600000; // OTP expires in 1 hour

    // Create and save the new user
    user = new User({ name, email, password, otp, otpExpires });
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: 'webproject2026@gmail.com',
      to: user.email,
      subject: 'Verify Your Email',
      html: `<h4>Your OTP is <strong>${otp}</strong>. It will expire in 1 hour.</h4>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered. Please check your email for the OTP to verify your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

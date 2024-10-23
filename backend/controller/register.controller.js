
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import nodemailer from "nodemailer";

// Nodemailer setup
const transporter = nodemailer.createTransport({
port: 465,
  auth: {
    user: 'pvikivikas5@gmail.com',
    pass: 'bmry iejv mlqu ypyb',
  },
});

// Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = Date.now() + 3600000; // 1 hour from now

    user = new User({ name, email, password, verificationToken, verificationExpires });
    await user.save();

    // Send verification email
    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    const mailOptions = {
      from: 'pvikivikas5@gmail.com',
      to: user.email,
      subject: 'Verify Your Email',
      html: `<h4>Click <a href="${verificationLink}">here</a> to verify your account. The link will expire in 1 hour.</h4>`,
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered. Please check your email to verify the account.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};






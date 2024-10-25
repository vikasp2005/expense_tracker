import { User } from "../model/user.model.js";

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Set user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

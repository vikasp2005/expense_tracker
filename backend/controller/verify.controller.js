import { User } from "../model/user.model.js";

// Verify email
export const verifyEmail = async (req, res) => {
    try {
      const user = await User.findOne({
        verificationToken: req.params.token,
        verificationExpires: { $gt: Date.now() },
      });
  
      if (!user) return res.status(400).send('Verification token is invalid or has expired.');
  
      user.verified = true;
      user.verificationToken = undefined;
      user.verificationExpires = undefined;
      await user.save();
  
      res.send('Email verified successfully. You can now log in.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };
  
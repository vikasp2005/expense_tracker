import express from "express";
import { register } from "../controller/register.controller.js";
import { verifyEmail } from "../controller/verify.controller.js";
import { login } from "../controller/login.controller.js";

const router = express.Router();

router.post("/register", register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);

// Add logout route (optional, as logout is mostly handled client-side by removing the token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;

import express  from "express";
import {register} from "../controller/register.controller.js";
import { verifyEmail  } from "../controller/verify.controller.js";
import { login } from "../controller/login.controller.js";

const router =express.Router();

router.post("/register",register);

router.get('/verify/:token',verifyEmail);

router.post('/login',login);

export default router;
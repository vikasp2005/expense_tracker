import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { connectDB } from "./db/connectDB.js";

import exprouter from "./router/exp.router.js";

import authrouter from "./router/auth.router.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // HTTP request logging


const PORT = process.env.PORT || 5000;




//===================================================
// Routes
app.use("/api/auth",authrouter);

app.use("/api/exp",exprouter);
// GET Route
app.get('/', (req, res) => {
  res.send("GET request received at '/'");
});




//===================================================
  // Centralized Error Handling Middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message,
      // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  });

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});
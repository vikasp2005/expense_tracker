import express  from "express";
import jwt from 'jsonwebtoken';
import { add_Exp } from "../controller/add.controller.js";
import { edit_Exp } from "../controller/edit.controller.js";
import { delete_Exp } from "../controller/delete.controller.js";
import { disp_Exp } from "../controller/disp.controller.js";
import { disp_by_id } from "../controller/dispbyid.controller.js";

const router =express.Router();



const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token'); // JWT token passed in headers

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token with your secret key
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};


router.post("/add_exp",authenticate,add_Exp);

router.put("/edit_exp/:id",authenticate,edit_Exp);

router.delete("/delete_exp/:id",authenticate,delete_Exp);

router.post("/disp_exp",authenticate,disp_Exp);

router.post("/disp_exp_by_id/:id",authenticate,disp_by_id);

export default router;
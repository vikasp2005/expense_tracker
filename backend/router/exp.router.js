import express  from "express";
import { authenticate } from "../utils/authenticate.js";
import { add_Exp } from "../controller/add.controller.js";
import { edit_Exp } from "../controller/edit.controller.js";
import { delete_Exp } from "../controller/delete.controller.js";
import { disp_Exp } from "../controller/disp.controller.js";
import { disp_by_id } from "../controller/dispbyid.controller.js";
import { send_exp_email } from "../controller/sende-exp.controller.js";



const router =express.Router();

router.post("/add_exp",authenticate,add_Exp);

router.put("/edit_exp/:id",authenticate,edit_Exp);

router.delete("/delete_exp/:id",authenticate,delete_Exp);

router.post("/disp_exp",authenticate,disp_Exp);

router.post("/disp_exp_by_id/:id",authenticate,disp_by_id);

router.post("/send-expenses-email",authenticate,send_exp_email);

export default router;
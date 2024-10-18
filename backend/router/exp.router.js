import express  from "express";
import { add_Exp } from "../controller/add.controller.js";
import { edit_Exp } from "../controller/edit.controller.js";
import { delete_Exp } from "../controller/delete.controller.js";
import { disp_Exp } from "../controller/disp.controller.js";
import { disp_by_id } from "../controller/dispbyid.controller.js";

const router =express.Router();

router.post("/add_exp",add_Exp);

router.put("/edit_exp/:id",edit_Exp);

router.delete("/delete_exp/:id",delete_Exp);

router.post("/disp_exp",disp_Exp);

router.post("/disp_exp_by_id/:id",disp_by_id);

export default router;
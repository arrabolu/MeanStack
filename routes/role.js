import express from "express";
import { createRole,updateRole,getRoles,deleteRole } from "../controller/role.controller.js";

const router = express.Router();

//create role in DB
router.post("/create", createRole);

//Update role in DB
router.put("/update/:id", updateRole);

// get all roles in Db
router.get("/getall", getRoles)

// Delete role
router.delete("/delete/:id", deleteRole)

export default router;

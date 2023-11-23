import  express  from "express";
import {getUsers,getUserByID} from "../controller/users.controller.js"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// For get all users
router.get('/getallusers', verifyAdmin, getUsers)

//Getting user by id
router.get('/userbyid/:id', verifyUser,  getUserByID)

export default router;
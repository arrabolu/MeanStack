import  express  from "express"
import { createUser, loginUser, createAdmin, forgetPassword } from "../controller/auth.controller.js"

const router = express.Router()

// Router For Register
router.post('/register',createUser)

// Router for Login
router.post('/login',loginUser)

router.post('/admin-register', createAdmin)

router.post('/send-email', forgetPassword)

export default router;
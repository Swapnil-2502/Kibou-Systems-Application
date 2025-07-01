import { Router } from "express";
import { Login, Register } from "../controllers/authControllers"

const router = Router();

router.post('/register',Register)
router.post('/login',Login)

export default router;
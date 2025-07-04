import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddlewares";
import { applyToTender, getMyApplication } from "../controllers/applicationsControllers";

const router = Router()

router.post("/",authenticateJWT,applyToTender)
router.get("/mine",authenticateJWT,getMyApplication)

export default router;
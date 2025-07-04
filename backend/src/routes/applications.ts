import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddlewares";
import { applyToTender, getApplicationsByTender, getMyApplication,  } from "../controllers/applicationsControllers";

const router = Router()

router.post("/",authenticateJWT,applyToTender)
router.get("/mine",authenticateJWT,getMyApplication)
router.get("/tender/:tenderId", authenticateJWT, getApplicationsByTender);

export default router;
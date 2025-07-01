import { Router } from "express";
import { createCompany, getMyCompany } from "../controllers/companyControllers";
import { authenticateJWT } from "../middlewares/authMiddlewares";

const router = Router()

router.post("/", authenticateJWT ,createCompany)
router.get("/me",authenticateJWT,getMyCompany)

export default router;
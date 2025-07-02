import { Router } from "express";
import { createCompany, getMyCompany, updateCompany } from "../controllers/companyControllers";
import { authenticateJWT } from "../middlewares/authMiddlewares";

const router = Router()

router.post("/", authenticateJWT ,createCompany)
router.get("/me",authenticateJWT,getMyCompany)
router.put("/:id",authenticateJWT,updateCompany)

export default router;
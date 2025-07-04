import { Router } from "express";
import { createCompany, getMyCompany, searchCompanies, updateCompany } from "../controllers/companyControllers";
import { authenticateJWT } from "../middlewares/authMiddlewares";

const router = Router()

router.post("/", authenticateJWT ,createCompany)
router.get("/me",authenticateJWT,getMyCompany)
router.put("/:id",authenticateJWT,updateCompany)
router.get("/search", searchCompanies);

export default router;
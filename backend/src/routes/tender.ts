import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddlewares";
import { createTender, getAllTenders, getMyTender, updateTender } from "../controllers/tenderController";

const router = Router();

router.post("/",authenticateJWT,createTender)
router.get("/",getAllTenders)
router.get("/mine",authenticateJWT,getMyTender)
router.put("/:id",authenticateJWT,updateTender)

export default router
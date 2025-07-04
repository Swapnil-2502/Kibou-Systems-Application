import { Router } from "express";
import { authenticateJWT } from "../middlewares/authMiddlewares";
import { createTender, deleteTender, getAllTenders, getMyTender, getTenderById, updateTender } from "../controllers/tenderController";

const router = Router();

router.post("/",authenticateJWT,createTender)
router.get("/",getAllTenders)

router.get("/mine",authenticateJWT,getMyTender)
router.put("/:id",authenticateJWT,updateTender)
router.delete("/:id",authenticateJWT,deleteTender)
router.get("/:id",authenticateJWT,getTenderById)

export default router
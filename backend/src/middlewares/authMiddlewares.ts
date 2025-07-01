import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request{
    userId: number
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded:any = verifyToken(token)
        req.userId = decoded.id;
        next()
    }
    catch(error){
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
}
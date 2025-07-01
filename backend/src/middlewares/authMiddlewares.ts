import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request{
    userId: number
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = verifyToken(token) as any;
        (req as AuthenticatedRequest).userId = decoded.id;
        next()
    }
    catch(error){
        res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        return;
    }
}
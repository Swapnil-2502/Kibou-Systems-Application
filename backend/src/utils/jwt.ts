import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '7d'})
}

export function verifyToken(token: string): any{
    return jwt.verify(token,JWT_SECRET)
}
import { Request, Response } from "express";
import db from "../utils/db"
import { AuthenticatedRequest } from "../middlewares/authMiddlewares";

export async function createCompany(req: Request, res: Response):Promise<any>{
    const { name, industry, description, logo_url } = req.body;
    const userId = (req as AuthenticatedRequest).userId

    if(!name || !industry) return res.status(400).json({ error: "Name and industry are required." });

    try{
        const existing = await db.query("SELECT * FROM companies WHERE user_id = $1", [userId]);
        if (existing.rows.length > 0) return res.status(400).json({ error: "You already have a company profile." });

        const result = await db.query(
            `INSERT INTO companies (user_id, name, industry, description, logo_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [userId, name, industry, description || "", logo_url || null]
        );

        res.status(201).json({ company: result.rows[0] });
    }
    catch(error){
        console.error("Error creating company:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export async function getMyCompany(req:Request, res: Response):Promise<any>{
    const userId = (req as AuthenticatedRequest).userId

    try{
        const result = await db.query(
            "SELECT * FROM Companies WHERE user_id = $1 LIMIT 1", [userId]
        )

        if(result.rows.length === 0) return res.status(404).json({company:null})
        res.status(200).json({ company: result.rows[0] });
    }
    catch(err){
        console.error("Error fetching company:", err);
        res.status(500).json({ error: "Internal server error" });
    }

}
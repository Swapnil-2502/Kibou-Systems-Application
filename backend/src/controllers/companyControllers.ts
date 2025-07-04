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

export async function updateCompany(req: Request, res: Response): Promise<any>{
    const userId = (req as AuthenticatedRequest).userId

    const companyId = parseInt(req.params.id);

    const { name, industry, description, logo_url } = req.body;

    try{
        const existing = await db.query(
             "SELECT * FROM companies WHERE id = $1 AND user_id = $2",
             [companyId, userId]
        )

        if(existing.rows.length === 0){
            return res.status(403).json({ error: "Unauthorized or company not found." });
        }

        const updated = await db.query(
            `UPDATE companies
            SET name = $1, industry = $2, description = $3, logo_url = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING *`,
            [name, industry, description, logo_url, companyId]
        )
        
        res.status(200).json({ company: updated.rows[0] });
    }
    catch(error){
        console.error("Update company error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}

export const searchCompanies = async (req: Request, res: Response):Promise<any> => {
  const query = req.query.query as string;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const result = await db.query(
      `SELECT id, name, industry, description, logo_url
       FROM companies
       WHERE LOWER(name) LIKE $1 OR LOWER(industry) LIKE $1
       ORDER BY name ASC`,
      [`%${query.toLowerCase()}%`]
    );

    res.json({ companies: result.rows });
  } catch (err) {
    console.error("Error searching companies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

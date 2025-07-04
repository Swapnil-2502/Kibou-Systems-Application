import { Request, response, Response } from "express";
import db from "../utils/db";
import { AuthenticatedRequest } from "../middlewares/authMiddlewares";

export const applyToTender = async (req: Request, res: Response):Promise<any> => {
    const { tender_id, message, budget } = req.body;
    const userId = (req as AuthenticatedRequest).userId

    if(!tender_id || !budget) return res.status(400).json({ error: "tender_id and budget are required" });
    
    try{
        const companyResult = await db.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if(companyResult.rows.length === 0){
            return res.status(400).json({ error: "User has no company profile" });
        }
        const company_id = companyResult.rows[0].id;

        const existing = await db.query(
            "SELECT id FROM applications WHERE tender_id = $1 AND company_id = $2",
            [tender_id, company_id]
        )
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Already applied to this tender" });
        }

        await db.query(
            `INSERT INTO applications (tender_id, company_id, message, budget)
            VALUES ($1, $2, $3, $4)`,
            [tender_id, company_id, message, budget]
        );

        res.status(201).json({ success: true, message: "Application submitted" });
    }
    catch(error){
        console.error("Error submitting application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMyApplication = async (req: Request, res: Response): Promise<any> => {
  const userId = (req as AuthenticatedRequest).userId;

  try {
    const companyResult = await db.query("SELECT id FROM companies WHERE user_id = $1", [userId]);
    if (companyResult.rows.length === 0) {
      return res.status(400).json({ error: "Company profile not found" });
    }

    const company_id = companyResult.rows[0].id;

    const result = await db.query(
      `SELECT 
         a.id AS application_id,
         a.message,
         a.budget,
         a.tender_id,
         t.title,
         t.description,
         t.deadline,
         t.budget AS tender_budget
       FROM applications a
       JOIN tenders t ON a.tender_id = t.id
       WHERE a.company_id = $1
       ORDER BY a.created_at DESC`,
      [company_id]
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error("Error getting applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

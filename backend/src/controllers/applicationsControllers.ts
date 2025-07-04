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

export const getApplicationsByTender = async (req: Request, res: Response):Promise<any> => {
  const userId = (req as AuthenticatedRequest).userId;
  const tenderId = parseInt(req.params.tenderId);

  if (isNaN(tenderId)) {
    return res.status(400).json({ error: "Invalid tender ID" });
  }

  try {
    // 1. Ensure the tender belongs to the user
    const tenderCheck = await db.query(
      `SELECT t.id
       FROM tenders t
       JOIN companies c ON t.company_id = c.id
       WHERE t.id = $1 AND c.user_id = $2`,
      [tenderId, userId]
    );

    if (tenderCheck.rows.length === 0) {
      return res.status(403).json({ error: "You do not own this tender" });
    }
    
    const result = await db.query(
      `SELECT 
         a.id AS application_id,
         a.message,
         a.budget,
         a.created_at,
         comp.name AS company_name,
         comp.industry AS company_industry
       FROM applications a
       JOIN companies comp ON a.company_id = comp.id
       WHERE a.tender_id = $1
       ORDER BY a.created_at DESC`,
      [tenderId]
    );

    res.json({ applications: result.rows });
  } catch (err) {
    console.error("Error retrieving applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

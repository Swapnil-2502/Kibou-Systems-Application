import { Request, Response } from "express";
import db from "../utils/db"
import { AuthenticatedRequest } from "../middlewares/authMiddlewares";

export async function createTender(req: Request,res: Response):Promise<any>{
    const userId = (req as AuthenticatedRequest).userId

    const {title, description, deadline, budget} = req.body;

    try{
        const companyRes = await db.query(
            "SELECT id FROM COMPANIES WHERE user_id = $1 LIMIT 1",
            [userId]
        )

        if (companyRes.rows.length === 0) {
            return res.status(403).json({ error: "Company profile not found" });
        }

        const companyId = companyRes.rows[0].id;

        const result = await db.query(
            `INSERT INTO tenders (company_id, title, description, deadline, budget)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [companyId, title, description, deadline, budget]
        )

        res.status(201).json({ tender: result.rows[0] })
    }
    catch(error){
        console.error("Error creating tender:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export async function getAllTenders(req: Request,res: Response):Promise<any>{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    try{
        const result = await db.query(
            `
            SELECT t.*, c.name as Company_Name, c.logo_url 
            FROM tenders t
            JOIN companies c ON t.company_id = c.id
            ORDER BY t.created_at DESC
            LIMIT $1 OFFSET $2
            `
            ,[limit,offset]
        )

        const totalRes = await db.query(`SELECT COUNT(*) FROM tenders`);
        const totalCount = parseInt(totalRes.rows[0].count);

        res.json({
            tenders: result.rows,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            },
        });
    }
    catch(error){
        console.error("Error getting tenders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getMyTender(req:Request,res:Response):Promise<any>{
    const userId = (req as AuthenticatedRequest).userId
    
    try{
        const companyResult = await db.query(
            "SELECT id FROM companies WHERE user_id = $1 LIMIT 1",
            [userId]
        );

        if(companyResult.rows.length === 0) return res.status(403).json({ error: "Company not found for user" });

        const companyId = companyResult.rows[0].id;

        const TenderResult = await db.query(
            'SELECT * FROM tenders WHERE company_id = $1 ORDER BY created_at DESC', [companyId]
        )

        res.json({ tenders: TenderResult.rows });
    }
    catch(error){
        console.error("Error fetching user's tenders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateTender(req:Request,res:Response):Promise<any>{
    const userId = (req as AuthenticatedRequest).userId
    const tenderId = parseInt(req.params.id);
    const { title, description, deadline, budget } = req.body;


    try{
        const CompanyResult = await db.query(
            "Select id From companies Where user_id = $1", [userId]
        )

        if (CompanyResult.rows.length === 0) {
            return res.status(403).json({ error: "Company not found" });
        }
        const companyId = CompanyResult.rows[0].id;

        const TenderCheck = await db.query(
            "SELECT * FROM tenders WHERE id = $1 AND company_id = $2", [tenderId,companyId]
        )

        if (TenderCheck.rows.length === 0) {
            return res.status(403).json({ error: "You do not own this tender" });
        }

        const updateTender = await db.query(
             `UPDATE tenders 
            SET title = $1, description = $2, deadline = $3, budget = $4 
            WHERE id = $5
            RETURNING *`,
            [title, description, deadline, budget, tenderId]
        )
        res.json({ tender: updateTender.rows[0] });
    }
    catch(error){
        console.error("Error updating tender:", error);
        res.status(500).json({ error: "Internal server error" });
    }   
}   
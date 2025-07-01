import { Request,Response } from "express";
import db from '../utils/db'
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export async function Register(req: Request,res: Response):Promise<any>{
    const {email,password} = req.body

    if(!email || !password) return res.status(400).json({error: "Email & Password required"})

    try{
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1',[email])
        if(existingUser.rows.length > 0) return res.status(409).json({error:"Email is already registered, try Login"})
        
        const hashedPassword = await bcrypt.hash(password,10)

        const result = await db.query('INSERT INTO users (email,password) VALUES ($1,$2) RETURNING id,email',[email,hashedPassword])

        const token = generateToken({id: result.rows[0].id})

        res.status(201).json({msg:"Registration Success",user: result.rows[0],token})
    }
    catch(error){
        console.error("Register error:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function Login(req: Request,res: Response):Promise<any>{
    const {email,password} = req.body

    if(!email || !password) return res.status(400).json({ error: "Email and password are required" });

    try{
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Email not registered" });
        }

        const user = result.rows[0];

        const validatePassword = await bcrypt.compare(password,user.password)
        if(!validatePassword) return res.status(401).json({ error: "Incorrect Password" });

        const token = generateToken({ id: user.id });

        res.status(200).json({ user: { id: user.id, email: user.email }, token });
    }
    catch(error){
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });   
    }
}
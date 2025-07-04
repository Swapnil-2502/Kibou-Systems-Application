import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./utils/db"
import authRoutes from "./routes/auth"
import companyRoutes from "./routes/company"
import tenderRoutes from "./routes/tender"
import applicationRoutes from "./routes/applications"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/company",companyRoutes)
app.use("/api/tender",tenderRoutes)
app.use("/api/applications",applicationRoutes)

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("B2B Tender Platform Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Connecting to database b2b_tender in POSTGRESDB
db.query("SELECT NOW()")
  .then(res => console.log("PostgreSQL connected:", res.rows[0]))
  .catch(err => console.error("DB connection error", err))
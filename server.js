import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/Backend/Config/db.js";
import employeeRoutes from "./src/Backend/Routes/employeeRoutes.js";
import attendanceRoutes from "./src/Backend/Routes/attendance.routes.js";
import payrollRoutes from "./src/Backend/Routes/Payroll.routes.js"
dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", employeeRoutes);      // ✅ FIX
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";
import {
  getPayroll,
  createPayroll,
  updatePayroll,
  getPayrollById
} from "../Controller/Payroll.controller.js";

const router = express.Router();

router.get("/", getPayroll);
router.post("/", createPayroll);
router.put("/:id", updatePayroll);
router.get("/:id", getPayrollById);

export default router;
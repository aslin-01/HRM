import express from "express";
import {
  addCreditPayment,
  createCredit,
  getCredit,
  getCredits,
  // updateOverdueCredit
} from "../Controller/credit.controller.js";

const router = express.Router();

router.post("/credits", createCredit);
router.get("/credits", getCredits);
router.get("/credits/:id", getCredit);
router.post("/credits/:id/payments", addCreditPayment);
// router.put("/credits/:id/overdue", updateOverdueCredit);
export default router;


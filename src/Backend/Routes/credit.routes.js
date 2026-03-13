import express from "express";
import {
  addCreditPayment,
  createCredit,
  getCredit,
  getCredits,
} from "../Controller/credit.controller.js";

const router = express.Router();

router.post("/credits", createCredit);
router.get("/credits", getCredits);
router.get("/credits/:id", getCredit);
router.post("/credits/:id/payments", addCreditPayment);

export default router;


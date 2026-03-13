import express from "express";

import {
  getAttendance,
  markAttendance,
  closeAttendance
} from "../Controller/attendance.controller.js";

const router = express.Router();

router.get("/", getAttendance);

router.post("/mark/:id", markAttendance);

router.put("/close/:id", closeAttendance);

export default router;
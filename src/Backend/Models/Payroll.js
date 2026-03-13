import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({

  employeeId: String,
  employeeName: String,
  agentName: String,

  fromDate: Date,
  toDate: Date,

  daysWorked: Number,
  salary: Number,
  advancePaid: Number,
  balance: Number

},{ timestamps:true });

const Payroll = mongoose.model("Payroll", payrollSchema);

export default Payroll;
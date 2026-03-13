import Payroll from "../Models/Payroll.js";

import Attendance from "../Models/Attendance.js";
import Employee from "../Models/newemployee.js";

export const getPayroll = async (req, res, next) => {

  try {

    const { fromDate, toDate } = req.query;

    // Build date filter only if a range is provided; otherwise include all attendance
    const filter = {};
    let start = null;
    let end = null;

    if (fromDate && toDate) {
      start = new Date(fromDate);
      start.setUTCHours(0, 0, 0, 0);
      end = new Date(toDate);
      end.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: start,
        $lte: end
      };
    }

    const attendance = await Attendance.find(filter);
    console.log("getPayroll filter:", filter, "attendance count:", attendance.length);

    // Build map of employeeId -> agent name from Employee collection
    const employees = await Employee.find({}, "employeeId agent");
    const agentMap = {};
    employees.forEach((emp) => {
      agentMap[emp.employeeId] = emp.agent || "-";
    });

    const payrollMap = {};

    attendance.forEach((item) => {

      const key = item.employeeId;

      if (!payrollMap[key]) {
        payrollMap[key] = {
          employeeId: item.employeeId,
          employeeName: item.name,
          agentName: agentMap[item.employeeId] || "-",
          fromDate: start,
          toDate: end,
          daysWorked: 0,
          salary: 0,
          advancePaid: 0
        };
      }

      payrollMap[key].daysWorked += 1;
      payrollMap[key].salary += Number(item.salary || 0);
      payrollMap[key].advancePaid += Number(item.advancePaid || 0);

    });

    const payroll = Object.values(payrollMap).map((p) => ({
      ...p,
      balance: p.salary - p.advancePaid
    }));

    res.json(payroll);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// CREATE PAYROLL
export const createPayroll = async (req, res, next) => {
  try {

    const payroll = await Payroll.create(req.body);

    res.status(201).json(payroll);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PAYROLL
export const updatePayroll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { advancePaid, fromDate, toDate } = req.body;

    let filter = { employeeId: id };
    if (fromDate && toDate) {
      let start = new Date(fromDate);
      start.setUTCHours(0, 0, 0, 0);
      let end = new Date(toDate);
      end.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: start,
        $lte: end
      };
    }

    const attendances = await Attendance.find(filter).sort({ date: -1 });

    if (attendances.length > 0) {
      const latest = attendances[0];
      latest.advancePaid = advancePaid;
      await latest.save();

      if (attendances.length > 1) {
        const olderIds = attendances.slice(1).map(a => a._id);
        await Attendance.updateMany({ _id: { $in: olderIds } }, { $set: { advancePaid: 0 } });
      }
    }

    res.json({ message: "Payroll updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayrollById = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const { id } = req.params;
    // Date filter: only when a range is provided; otherwise include all attendance for that employee
    let filter = { employeeId: id };

    let start = null;
    let end = null;
    if (fromDate && toDate) {
      start = new Date(fromDate);
      start.setUTCHours(0, 0, 0, 0);
      end = new Date(toDate);
      end.setUTCHours(23, 59, 59, 999);
      filter.date = {
        $gte: start,
        $lte: end
      };
    }

    const attendance = await Attendance.find(filter);
    console.log("getPayrollById filter:", filter, "attendance count:", attendance.length);

    if (!attendance.length) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const payroll = {
      employeeId: attendance[0].employeeId,
      employeeName: attendance[0].name,
      agentName: attendance[0].agentName,
      fromDate: start,
      toDate: end,
      daysWorked: attendance.length,
      salary: attendance.reduce((a,b)=>a + Number(b.salary || 0),0),
      advancePaid: attendance.reduce((a,b)=>a + Number(b.advancePaid || 0),0)
    };

    payroll.balance = payroll.salary - payroll.advancePaid;

    res.json(payroll);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





import Attendance from "../Models/Attendance.js";
import Employee from "../Models/newemployee.js";
import cron from "node-cron";


cron.schedule("0 0 * * *", async () => {

  try {

    console.log("Running Auto Absent Job...");

    const today = new Date();
    today.setHours(0,0,0,0);

    const employees = await Employee.find();

    for (const emp of employees) {

      const attendance = await Attendance.findOne({
        employee: emp._id,
        date: today
      });

      if (!attendance) {

        await Attendance.create({
          employee: emp._id,
          employeeId: emp.employeeId,
          name: emp.name,
          status: "absent",
          date: today
        });

      }

    }

    console.log("Auto Absent Completed");

  } catch (error) {
    console.log(error);
  }

});


// ================= GET ATTENDANCE TABLE =================
export const getAttendance = async (req, res, next) => {
  try {

    const search = req.query.search || "";
    const status = req.query.status || "";

    const today = new Date();
today.setHours(0,0,0,0);

    const employees = await Employee.find();

    const attendanceData = await Promise.all(
      employees.map(async (emp) => {

        const attendance = await Attendance.findOne({
          employee: emp._id,
          date: today
        });

        return {
          employeeMongoId: emp._id,
          employeeId: emp.employeeId,
          name: emp.name,

          salary: emp.salary,
          finalSalary: attendance?.salary || "-",
          advancePaid: attendance?.advancePaid || 0,

          attendanceId: attendance?._id || null,
          inTime: attendance?.inTime || "-",
          outTime: attendance?.outTime || "-",
          status: attendance?.status || "-"
        };
      })
    );

    let filtered = attendanceData;

    // SEARCH
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.employeeId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // STATUS FILTER
    if (status && status !== "All") {
      filtered = filtered.filter(
        (item) => item.status === status.toLowerCase()
      );
    }

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= MARK ATTENDANCE =================
// ================= MARK ATTENDANCE =================
export const markAttendance = async (req, res, next) => {
  try {

    const employee = await Employee.findById(req.params.id);

    const today = new Date();
today.setHours(0,0,0,0);

    const existing = await Attendance.findOne({
      employee: employee._id,
      date: today
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked today" });
    }

    const attendance = await Attendance.create({
      employee: employee._id,
      employeeId: employee.employeeId,
      name: employee.name,
      status: req.body.status,
      inTime: req.body.inTime,
      date: today
    });

    res.status(201).json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= CLOSE ATTENDANCE =================
export const closeAttendance = async (req, res, next) => {

try {

const attendance = await Attendance.findById(req.params.id);

if(!attendance){
return res.status(404).json({message:"Attendance not found"});
}

attendance.outTime = req.body.outTime;
attendance.salary = Number(req.body.salary);
attendance.advancePaid = Number(req.body.advancePaid);

await attendance.save();

res.json(attendance);

} catch (error) {
res.status(500).json({message:error.message});
}

};
// ================= CREATE EMPLOYEE =================
export const createEmployee = async (req, res, next) => {
  try {

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

    const nextId = lastEmployee
      ? String(Number(lastEmployee.employeeId) + 1).padStart(2, "0")
      : "01";

    const employee = await Employee.create({
      ...req.body,
      employeeId: nextId
    });

    res.status(201).json(employee);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= GET ALL EMPLOYEES =================
export const getEmployees = async (req, res, next) => {

  try {

    const employees = await Employee.find().sort({ createdAt: -1 });

    res.json(employees);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= GET SINGLE EMPLOYEE =================
export const getEmployee = async (req, res, next) => {

  try {

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE EMPLOYEE =================
export const updateEmployee = async (req, res, next) => {

  try {

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(employee);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE EMPLOYEE =================
export const deleteEmployee = async (req, res) => {

  try {

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ message: "Employee deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
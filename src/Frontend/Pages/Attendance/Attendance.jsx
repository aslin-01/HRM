// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Attendance = () => {

//   const [employees,setEmployees] = useState([]);

//   const fetchAttendance = async () =>{
//     const res = await axios.get("http://localhost:5000/api/attendance");
//     setEmployees(res.data);
//   };

//   useEffect(()=>{
//     fetchAttendance();
//   },[]);

//   const markAttendance = async(id)=>{
//     await axios.post(`http://localhost:5000/api/attendance/mark/${id}`);
//     fetchAttendance();
//   };

//   const closeAttendance = async(id)=>{
//     await axios.post(`http://localhost:5000/api/attendance/close/${id}`);
//     fetchAttendance();
//   };

//   return (

// <div className="bg-[#f4f4f4] min-h-screen p-8">

// <div className="bg-white border border-yellow-400 rounded-xl p-6">

// {/* HEADER */}

// <div className="flex justify-between mb-6">

// <h2 className="text-xl font-semibold">Attendance</h2>

// <div className="flex gap-3">

// <select className="border px-3 py-2 rounded">

// <option>All</option>
// <option>Present</option>
// <option>Absent</option>

// </select>

// <input
// type="text"
// placeholder="Search by name or EMP"
// className="border px-3 py-2 rounded"
// />

// </div>

// </div>

// {/* TABLE */}

// <table className="w-full text-sm">

// <thead>

// <tr className="text-gray-600 border-b">

// <th className="py-3">Sl no</th>
// <th>EMP ID</th>
// <th>Employee Name</th>
// <th>In Time</th>
// <th>Out Time</th>
// <th>Salary</th>
// <th>Status</th>
// <th>Action</th>

// </tr>

// </thead>

// <tbody>

// {employees.map((emp,index)=>(

// <tr key={emp._id} className="border-b text-center">

// <td className="py-4">{index+1}</td>
// <td>{emp.empId}</td>
// <td>{emp.name}</td>
// <td>{emp.inTime || "-"}</td>
// <td>{emp.outTime || "-"}</td>
// <td>{emp.salary || "-"}</td>

// <td className="text-green-600 font-semibold">
// {emp.status}
// </td>

// <td>

// {emp.inTime && !emp.outTime ? (

// <button
// onClick={()=>closeAttendance(emp._id)}
// className="bg-red-500 text-white px-4 py-1 rounded"
// >
// CLOSE ATTENDANCE
// </button>

// ) : emp.outTime ? (

// <button
// className="bg-gray-300 px-4 py-1 rounded"
// >
// Attendance Closed
// </button>

// ) : (

// <button
// onClick={()=>markAttendance(emp._id)}
// className="bg-yellow-400 px-4 py-1 rounded"
// >
// MARK ATTENDANCE
// </button>

// )}

// </td>

// </tr>

// ))}

// </tbody>

// </table>

// </div>

// </div>

//   );
// };

// export default Attendance;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);

  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [outTime, setOutTime] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [inTime, setInTime] = useState("");
  const [status, setStatus] = useState("present");
  const [salary, setSalary] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:5000/api/attendance");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // OPEN MARK MODAL
  const openMarkModal = (emp) => {
    setSelectedEmployee(emp);
    setShowMarkModal(true);
  };

  // OPEN CLOSE MODAL
  const openCloseModal = (emp) => {
    setSelectedEmployee(emp);
    setAdvancePaid("");
    setSalary(emp.salary || 0);
    setOutTime("");
    setShowCloseModal(true);
  };

  // MARK ATTENDANCE
  const markAttendance = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/attendance/mark/${selectedEmployee.employeeMongoId}`,
        {
          status,
          inTime,
        },
      );

      const newAttendance = res.data;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeMongoId === selectedEmployee.employeeMongoId
            ? {
                ...emp,
                inTime: newAttendance.inTime,
                status: newAttendance.status,
                attendanceId: newAttendance._id,
              }
            : emp,
        ),
      );

      setShowMarkModal(false);
      setSelectedEmployee(null);

      fetchAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  // CLOSE ATTENDANCE
  const closeAttendance = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/attendance/close/${selectedEmployee.attendanceId}`,
        {
          salary: Number(salary),
          advancePaid: Number(advancePaid),
          outTime,
        },
      );

      setShowCloseModal(false);
      setSelectedEmployee(null);
      setSalary("");
      setAdvancePaid("");

      fetchAttendance();
    } catch (err) {
      console.log(err);
    }
  };
  // const calculateSalary = () => {

  // if(!selectedEmployee?.inTime || !outTime) return;

  // const start = new Date(`1970-01-01T${selectedEmployee.inTime}`);
  // const end = new Date(`1970-01-01T${outTime}`);

  // const diff = (end - start) / (1000 * 60 * 60); // hours

  // const hourlyRate = selectedEmployee.salary || 0;

  // const totalSalary = diff * hourlyRate;

  // const finalSalary = totalSalary - (advancePaid || 0);

  // setSalary(finalSalary);

  // };

  // const calculateSalary = (advanceValue, newOutTime) => {

  // if(!selectedEmployee?.inTime || !newOutTime) return;

  // const start = new Date(`1970-01-01T${selectedEmployee.inTime}`);
  // const end = new Date(`1970-01-01T${newOutTime}`);

  // const diffHours = (end - start) / (1000 * 60 * 60);

  // const hourlyRate = Number(selectedEmployee.salary) || 0;

  // const totalSalary = diffHours * hourlyRate;

  // const advance = Number(advanceValue) || 0;

  // setSalary(totalSalary - advance);

  // };

  return (
    <div className="min-h-screen">
      <div className="bg-white border border-yellow-400 rounded-xl p-6">
        {/* HEADER */}

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Attendance</h2>

          <div className="flex gap-3">
            <select className="border px-3 py-2 rounded">
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
            </select>

            <input
              type="text"
              placeholder="Search by name or EMP"
              className="border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* TABLE */}

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3">Sl no</th>
              <th>EMP ID</th>
              <th>Employee Name</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp, index) => (
              <tr key={index} className="border-b text-center">
                <td className="py-4">{index + 1}</td>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                <td>{emp.inTime || "-"}</td>
                <td>{emp.outTime || "-"}</td>
                <td>{emp.finalSalary || "-"}</td>

                <td
                  className={`font-semibold ${
                    emp.status === "present" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {emp.status || "-"}
                </td>

                <td>
                  {(!emp.inTime || emp.inTime === "-") &&
                  (!emp.outTime || emp.outTime === "-") ? (
                    <button
                      onClick={() => openMarkModal(emp)}
                      className="bg-yellow-400 px-4 py-1 rounded"
                    >
                      MARK ATTENDANCE
                    </button>
                  ) : emp.inTime &&
                    emp.inTime !== "-" &&
                    (!emp.outTime || emp.outTime === "-") ? (
                    <button
                      onClick={() => openCloseModal(emp)}
                      className="bg-[#FF6B6B] text-white px-4 py-1 rounded"
                    >
                      CLOSE ATTENDANCE
                    </button>
                  ) : (
                    <button className="bg-gray-300 px-4 py-1 rounded">
                      Attendance Closed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MARK ATTENDANCE MODAL */}

      {showMarkModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center"
          onClick={() => setShowMarkModal(false)}
        >
          <div
            className="bg-white w-[700px] p-6 rounded-lg border-2 border-yellow-400"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-6">Mark Attendance</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1">Employee Name</label>

                <input
                  value={selectedEmployee?.name}
                  readOnly
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Employee ID</label>

                <input
                  value={selectedEmployee?.employeeId}
                  readOnly
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">In Time</label>

                <input
                  type="time"
                  value={inTime}
                  onChange={(e) => setInTime(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Status</label>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={status === "present"}
                      onChange={() => setStatus("present")}
                    />
                    Present
                  </label>

                  <label className="flex items-center gap-2 text-red-500">
                    <input
                      type="radio"
                      checked={status === "absent"}
                      onChange={() => setStatus("absent")}
                    />
                    Absent
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={markAttendance}
                className="bg-yellow-400 px-6 py-2 rounded font-semibold"
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLOSE ATTENDANCE MODAL */}

      {/* CLOSE ATTENDANCE MODAL */}

      {showCloseModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowCloseModal(false)}
        >
          <div
            className="bg-white w-[700px] p-6 rounded-lg border-2 border-yellow-400"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE ICON */}
            <button
              onClick={() => setShowCloseModal(false)}
              className="absolute right-4 top-4 text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-8">Close Attendance</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee Name:
                </label>
                <input
                  value={selectedEmployee?.name}
                  readOnly
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee ID:
                </label>
                <input
                  value={selectedEmployee?.employeeId}
                  readOnly
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* In Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  In Time
                </label>
                <input
                  value={selectedEmployee?.inTime || "--"}
                  readOnly
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Out Time
                </label>
                <input
                  type="time"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>

              {/* Advance Paid */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Advance Paid
                </label>
                <input
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  className="border w-full px-3 py-2 rounded"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-1">Status</label>

              <p className="text-green-600 font-semibold">Present</p>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-8">
              <button
                onClick={closeAttendance}
                className="bg-yellow-400 px-6 py-2 rounded font-semibold"
              >
                Close Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

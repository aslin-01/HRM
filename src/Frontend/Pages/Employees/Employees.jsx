import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Employees = () => {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 8;

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ================= SEARCH FILTER =================
  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(search.toLowerCase()),
  );

  // pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Add this inside your component
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className=" min-h-screen ">
      {/* BACK BUTTON */}
      <div className="mb-4 text-xl cursor-pointer">←</div>

      <div className="bg-white border border-yellow-400 rounded-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Employees</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={() => navigate("/workers/add")}
              className="bg-yellow-400 px-4 py-1 rounded flex items-center gap-2 text-sm"
            >
              <FaPlus />
              Employee
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm text-center">
          <thead className="border-b">
            <tr className="text-gray-700">
              <th className="py-3">Sl.no</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Agent</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <tr key={emp._id || index} className="border-b">
                  <td className="py-3">{indexOfFirstEmployee + index + 1}</td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.age}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.address}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.agent}</td>
                  <td className="text-yellow-500 cursor-pointer align-middle text-center">
                    <FaEye className="inline-block" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-6 text-gray-500">
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody> */}

          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <React.Fragment key={emp._id || index}>
                  <tr className="border-b">
                    <td className="py-3">{indexOfFirstEmployee + index + 1}</td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>{emp.gender}</td>
                    <td>{emp.address}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.agent}</td>
                    <td
                      className="text-yellow-500 cursor-pointer align-middle text-center"
                      onClick={() => toggleRow(emp._id)}
                    >
                      <FaEye className="inline-block" />
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expandedRows[emp._id] && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="9" className="py-3 text-left px-4">
                        <div>
                          <p>
                            <strong>Email:</strong> {emp.email || "-"}
                          </p>
                          <p>
                            <strong>Salary:</strong> {emp.salary || "-"}
                          </p>
                          <p>
                            <strong>Join Date:</strong> {emp.joinDate || "-"}
                          </p>
                          <p>
                            <strong>Other Info:</strong> {emp.otherInfo || "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-6 text-gray-500">
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {/* <div className="flex justify-center items-center mt-6 gap-5">

          <FaChevronLeft className="text-yellow-400 cursor-pointer" />

          <div className="bg-yellow-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">
            1
          </div>

          <FaChevronRight className="text-yellow-400 cursor-pointer" />

        </div> */}

        {filteredEmployees.length > 8 && (
          <div className="flex justify-center items-center mt-6 gap-4">
            <FaChevronLeft
              onClick={prevPage}
              className="text-yellow-400 cursor-pointer"
            />

            {[...Array(totalPages)].map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer
        ${currentPage === i + 1 ? "bg-yellow-400" : "border border-yellow-400"}`}
              >
                {i + 1}
              </div>
            ))}

            <FaChevronRight
              onClick={nextPage}
              className="text-yellow-400 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;

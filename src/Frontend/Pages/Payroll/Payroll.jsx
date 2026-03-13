import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Payroll = () => {
  
 const [payroll, setPayroll] = useState([]);
const [search, setSearch] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const [currentPage, setCurrentPage] = useState(1);
const payrollPerPage = 8;

const [showModal, setShowModal] = useState(false);
const [selectedPayroll, setSelectedPayroll] = useState(null);

const [amount, setAmount] = useState("");
const [status, setStatus] = useState("");
const [remainingBalance, setRemainingBalance] = useState(0);

// SEARCH
const filteredPayroll = payroll.filter((item) =>
  item.employeeName?.toLowerCase().includes(search.toLowerCase())
);

// PAGINATION INDEX
const indexOfLast = currentPage * payrollPerPage;
const indexOfFirst = indexOfLast - payrollPerPage;

// CURRENT PAGE DATA
const currentPayroll = filteredPayroll.slice(indexOfFirst, indexOfLast);

// TOTAL PAGES
const totalPages = Math.ceil(filteredPayroll.length / payrollPerPage);

  // FETCH PAYROLL
  const fetchPayroll = async () => {
    try {
      const params = {};

      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }

      const res = await axios.get("http://localhost:5000/api/payroll", {
        params,
      });
      setPayroll(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [fromDate, toDate]);

  // SEARCH
//   const filteredPayroll = payroll.filter((item) =>
//     item.employeeName?.toLowerCase().includes(search.toLowerCase()),
//   );

  // PAGINATION


//   const totalPages = Math.ceil(filteredPayroll.length / payrollPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const savePayment = async () => {
    if (!amount) {
      alert("Enter payment amount");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/payroll/${selectedPayroll.employeeId}`,
        {
          advancePaid: selectedPayroll.advancePaid + amount,
          fromDate: selectedPayroll.fromDate,
          toDate: selectedPayroll.toDate
        }
      );

      fetchPayroll();
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPayrollDetails = async (id) => {
    try {
      const params = {};

      if (fromDate && toDate) {
        params.fromDate = fromDate;
        params.toDate = toDate;
      }

      const res = await axios.get(`http://localhost:5000/api/payroll/${id}`, {
        params,
      });
      setSelectedPayroll(res.data);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);
    setAmount(value);

    const balance = Number(selectedPayroll.balance);

    if (value > balance) {
      alert("Amount cannot be greater than balance");
      setAmount("");
      return;
    }

    const newBalance = balance - value;
    setRemainingBalance(newBalance);

    if (newBalance === 0) {
      setStatus("Issued");
    } else {
      setStatus("Pending");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedPayroll({
      ...selectedPayroll,
      [name]: value,
    });
  };
  return (
    <div className="min-h-screen">
      {/* BACK BUTTON */}
      <div className="mb-4 text-xl cursor-pointer">←</div>

      <div className="bg-white border border-yellow-400 rounded-lg p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Pay Roll</h2>

          <div className="flex gap-3 items-end">
            <div className="flex flex-col text-sm">
              <label>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>

            <div className="flex flex-col text-sm">
              <label>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded px-3 py-1"
              />
            </div>

            <input
              type="text"
              placeholder="Search..."
              className="border rounded px-3 py-1 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}

        <table className="w-full text-sm text-center">
          <thead className="border-b">
            <tr className="text-gray-700">
              <th className="py-3">Sl.no</th>
              <th>EMP ID</th>
              <th>Employee Name</th>
              <th>Agent Name</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Days Worked</th>
              <th>Salary</th>
              <th>Advance Paid</th>
              <th>Balance</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentPayroll.length > 0 ? (
              currentPayroll.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{indexOfFirst + index + 1}</td>
                  <td>{item.employeeId}</td>
                  <td>{item.employeeName}</td>
                  <td>{item.agentName || "-"}</td>
                  <td>
                    {item.fromDate
                      ? new Date(item.fromDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {item.toDate
                      ? new Date(item.toDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{item.daysWorked}</td>

                  <td className="text-orange-500 font-semibold">
                    ₹{item.salary}
                  </td>

                  <td className="text-red-500">{item.advancePaid}</td>

                  <td className="text-green-600 font-semibold">
                    {item.balance}
                  </td>

                  <td
                    className="text-yellow-500 cursor-pointer"
                    onClick={() => {
                      setSelectedPayroll(item);
                      setAmount("");
                      setStatus("");
                      setRemainingBalance(0);
                      setShowModal(true);
                    }}
                  >
                    <FaEye className="inline-block" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="py-6 text-gray-500">
                  No Payroll Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}

        {filteredPayroll.length > 8 && (
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
      {showModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[700px] max-h-[85vh] overflow-y-auto rounded-lg border-2 border-yellow-400 p-6">
            <h2 className="text-lg font-semibold mb-6">Payroll Details</h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <b>Employee ID :</b> {selectedPayroll.employeeId}
              </p>
              <p>
                <b>Employee Name :</b> {selectedPayroll.employeeName}
              </p>

              <p>
                <b>Agent Name :</b> {selectedPayroll.agentName}
              </p>
              <p>
                <b>Days Worked :</b> {selectedPayroll.daysWorked}
              </p>

              <p>
                <b>From Date :</b>{" "}
                {selectedPayroll.fromDate
                  ? new Date(selectedPayroll.fromDate).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <b>To Date :</b>{" "}
                {selectedPayroll.toDate
                  ? new Date(selectedPayroll.toDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div className="mt-6 text-sm">
              <p className="mb-2">
                <b>Salary :</b>
                <span className="text-orange-500 font-semibold ml-2">
                  ₹{selectedPayroll.salary}
                </span>
              </p>

              <p className="mb-2">
                <b>Advance Paid :</b>
                <span className="text-red-500 ml-2">
                  ₹{selectedPayroll.advancePaid}
                </span>
              </p>

              <p>
                <b>Balance :</b>
                <span className="text-green-600 font-semibold ml-2">
                  ₹{amount ? remainingBalance : selectedPayroll.balance}
                </span>
              </p>
            </div>

            {/* PAYMENT SECTION */}

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <label className="text-sm">Amount</label>

                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="border w-full rounded px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm">Status</label>

                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Issued"}
                      readOnly
                    />
                    <span className="text-green-600">Issued</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "Pending"}
                      readOnly
                    />
                    <span className="text-yellow-500">Pending</span>
                  </label>
                </div>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={savePayment}
                className="bg-yellow-400 px-6 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;

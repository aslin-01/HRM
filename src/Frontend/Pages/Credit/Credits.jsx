import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Credits = () => {
  const navigate = useNavigate();

  const [credits, setCredits] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchCredits = async (params = {}) => {
    try {
      const res = await axios.get("http://localhost:5000/api/credits", {
        params,
      });
      setCredits(res.data || []);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchCredits({ startDate, endDate });
    } else {
      fetchCredits();
    }
  }, [startDate, endDate]);
  const formatDate = (value) => {
    if (!value) return "-";
    // if it's already dd/mm/yyyy etc, just show it
    if (typeof value === "string" && value.includes("/")) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const totalPayable = (credit) => Number(credit?.payable ?? 0);
  const totalPaid = (credit) => Number(credit?.totalPaid ?? 0);
  const balancePayable = (credit) =>
    Number(credit?.balancePayable ?? credit?.payable ?? 0);

  const totalAmount = (credit) => {
    const paid = Number(credit?.totalPaid || 0);
    const balance = Number(credit?.balancePayable ?? credit?.payable ?? 0);
    return paid + balance;
  };

  const todayDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB");
  };

  const getInterestDisplay = (credit) => {
    if (!credit?.due) return credit?.interest;

    const original = Number(
      credit?.originalInterestRate ||
        String(credit?.interest || "0").replace("%", ""),
    );

    const dueDate = new Date(credit.due);
    const today = new Date();

    if (today <= dueDate) {
      return `${original} x 1`;
    }

    // calculate months difference
    const months =
      (today.getFullYear() - dueDate.getFullYear()) * 12 +
      (today.getMonth() - dueDate.getMonth());

    const multiplier = months + 2;
    // +1 for original month +1 for first overdue

    return `${original} x ${multiplier}`;
  };

  const monthsFromDueDate = (credit) => {
    if (!credit?.due) return 0;

    const due = new Date(credit.due);
    const today = new Date();

    if (today <= due) return 0;

    let months =
      (today.getFullYear() - due.getFullYear()) * 12 +
      (today.getMonth() - due.getMonth());

    if (today.getDate() < due.getDate()) {
      months -= 1;
    }

    return months < 0 ? 0 : months;
  };

  const applyOverdueToCredit = (credit) => {
    if (!credit || getDueWarning(credit) !== "passed") return credit;

    const calc = calculateOverdueAmount(credit);

    return {
      ...credit,
      balancePayable: calc.newTotal,
      payable: calc.newTotal,
      total: calc.newTotal,
      interest: `${calc.newRate}%`,
    };
  };

  // const savePayment = async () => {
  //   if (!paidAmount) {
  //     alert("Enter payment amount");
  //     return;
  //   }

  //   const paid = Number(paidAmount);
  //   const balance = balancePayable(selectedCredit);

  //   if (paid > balance) {
  //     alert("Amount cannot be greater than balance");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       `http://localhost:5000/api/credits/${selectedCredit._id}/payments`,
  //       { amountPaid: paid, paidAt: new Date().toISOString() },
  //     );

  //     // refresh list + update selected credit snapshot
  //     await fetchCredits();
  //     setSelectedCredit(res.data);
  //     setShowPaymentModal(false);
  //     setPaidAmount("");
  //   } catch (error) {
  //     console.error("Error saving payment:", error);
  //     alert("Failed to save payment");
  //   }
  // };

  const savePayment = async () => {
    if (!paidAmount) {
      alert("Enter payment amount");
      return;
    }

    const paid = Number(paidAmount);

    if (paid <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (!selectedCredit) {
      alert("No credit selected");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/credits/${selectedCredit._id}/payments`,
        {
          amountPaid: paid,
          paidAt: new Date().toISOString(),
        },
      );

      const updatedCredit = res.data;

      // update table
      setCredits((prev) =>
        prev.map((c) => (c._id === updatedCredit._id ? updatedCredit : c)),
      );

      // update modal data
      setSelectedCredit(updatedCredit);

      setShowPaymentModal(false);
      setPaidAmount("");
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Failed to save payment");
    }
  };

  const calculateMonthlyInterest = (credit) => {
    const principal = Number(
      credit.balancePayable ?? credit.payable ?? credit.amount ?? 0,
    );
    const originalRate = Number(
      credit.originalInterestRate ||
        String(credit.interest || "0").replace("%", ""),
    );

    const due = new Date(credit.due);
    const today = new Date();

    if (today <= due) {
      return {
        months: 0,
        rows: [],
        latestAmount: principal + (principal * originalRate) / 100,
      };
    }

    const months =
      (today.getFullYear() - due.getFullYear()) * 12 +
      (today.getMonth() - due.getMonth());

    let rows = [];

    for (let i = 1; i <= months; i++) {
      const rate = originalRate * (i + 1);
      const amount = principal + (principal * rate) / 100;

      rows.push({
        month: i,
        rate,
        amount,
      });
    }

    const latestRate = originalRate * (months + 1);
    const latestAmount = principal + (principal * latestRate) / 100;

    return {
      months,
      rows,
      latestAmount,
    };
  };

  const calculateMonthlyCompound = (credit) => {
    const principal = Number((credit.amount || 0) - (credit.totalPaid || 0));

    const rate = Number(
      credit.originalInterestRate ||
        String(credit.interest || "0").replace("%", ""),
    );

    const due = new Date(credit.due);
    const today = new Date();

    let months =
      (today.getFullYear() - due.getFullYear()) * 12 +
      (today.getMonth() - due.getMonth());

    if (today <= due) months = 0;

    let rows = [];

    // First month (original calculation)
    let amount = principal + (principal * rate) / 100;

    rows.push({
      label: "Original",
      rate: rate,
      amount: amount.toFixed(2),
    });

    // Monthly compound interest
    for (let i = 1; i <= months; i++) {
      const interest = (amount * rate) / 100;
      amount = amount + interest;

      rows.push({
        label: `Month ${i}`,
        rate: rate,
        amount: amount.toFixed(2),
      });
    }

    return {
      months,
      rows,
      latestAmount: amount.toFixed(2),
    };
  };

  const getDueWarning = (credit) => {
    if (!credit?.due) return null;

    const today = new Date();
    const due = new Date(credit.due);

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 5 && diffDays > 0) {
      return `⚠ Payment due in ${diffDays} day(s). Interest will double after due date.`;
    }

    if (diffDays <= 0) {
      return "passed";
    }

    return null;
  };

  const calculateOverdueAmount = (credit) => {
    const balance = Number(credit.balancePayable || credit.payable || 0);

    // take original interest from backend string
    const oldRate = Number(String(credit.interest || "0").replace("%", ""));

    // double it
    const newRate = oldRate * 2;

    // only extra interest
    const extraRate = newRate - oldRate;

    const interestAmount = (balance * extraRate) / 100;

    const newTotal = balance + interestAmount;

    return {
      balance,
      oldRate,
      newRate,
      newTotal,
    };
  };

  const parseInterest = (value) => {
    if (!value) return 0;
    return Number(String(value).replace("%", ""));
  };

  // const updateOverdueCredit = async (credit) => {
  //   const calc = calculateOverdueAmount(credit);

  //   try {
  //     await axios.put(`http://localhost:5000/api/credits/${credit._id}/overdue`, {
  //       interest: `${calc.newRate}%`,
  //       payable: calc.newTotal,
  //       balancePayable: calc.newTotal,
  //     });

  //     await fetchCredits();
  //   } catch (err) {
  //     console.error("Failed to update overdue credit", err);
  //   }
  // };

  return (
    <div className="p-6">
      <div className="border rounded-xl border-yellow-400 p-5 bg-white">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <FaArrowLeft className="cursor-pointer text-xl" />
            <h2 className="text-xl font-semibold">Credits</h2>

            <div className="bg-gray-100 px-4 py-1 rounded">
              Date: {todayDate()}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded"
            />

            <button
              onClick={() => navigate("/add-credit")}
              className="bg-yellow-400 px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus />
              Add Credits
            </button>
          </div>
        </div>

        {/* Table */}

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-3">Sl No.</th>
              <th>Name</th>
              <th>Received Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Interest</th>
              <th>Total Amount</th>
              <th>Amount to be paid</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {credits.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6 text-gray-400">
                  No Credits Found
                </td>
              </tr>
            ) : (
              credits.map((item, index) => (
                <tr key={item._id || index} className="border-b">
                  <td className="py-3">{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{formatDate(item.received)}</td>
                  <td>{formatDate(item.due)}</td>
                  <td>{item.amount}</td>
                  <td>{item.interest}</td>
                  <td>₹{calculateMonthlyCompound(item).latestAmount}</td>
                  <td>
                    ₹
                    {calculateMonthlyCompound(item).latestAmount -
                      (item.totalPaid || 0)}
                  </td>

                  <td
                    className={
                      item.status === "paid" ? "text-green-600" : "text-red-500"
                    }
                  >
                    {item.status}
                  </td>

                  <td className="flex gap-3 py-3">
                    {/* Eye Button */}

                    <FaEye
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        setSelectedCredit(item);
                        setShowEditModal(true);

                        if (getDueWarning(item) === "passed") {
                          // updateOverdueCredit(item);
                        }
                      }}
                    />

                    {/* Pen Button */}
                    {item.status !== "paid" && (
                      <FaEdit
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => {
                          setSelectedCredit(item);
                          setPaidAmount("");
                          setShowPaymentModal(true);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex justify-center items-center gap-4 mt-5">
          <FaChevronLeft className="cursor-pointer text-yellow-500" />

          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            1
          </div>

          <FaChevronRight className="cursor-pointer text-yellow-500" />
        </div>
      </div>

      {/* ================= EDIT AMOUNT MODAL ================= */}
      {showEditModal && selectedCredit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[900px] rounded-lg border-2 border-yellow-400 p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold">Credit Details</h2>
            <hr className="my-4" />

            {(() => {
              const today = new Date();
              const due = new Date(selectedCredit.due);

              const calc = calculateMonthlyCompound(selectedCredit); // ADD THIS

              // Calculate days left
              const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

              // Clone credit for modal updates
              let updatedCredit = { ...selectedCredit };

              // ====== 5-DAY WARNING ======
              let fiveDayNotification = null;
              if (diffDays <= 5 && diffDays > 0) {
                fiveDayNotification = (
                  <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 mb-4 text-sm">
                    ⚠ Payment due in {diffDays} day(s). Interest will double
                    after due date.
                  </div>
                );
              }

              // ====== OVERDUE CALCULATION ======
              const isOverdue = diffDays <= 0;
              if (isOverdue) {
                const calc = calculateOverdueAmount(selectedCredit);

                updatedCredit.payable = calc.newTotal;
                updatedCredit.balancePayable = calc.newTotal;
                updatedCredit.interest = `${calc.oldRate}%`;

                if (!selectedCredit.lastInterestAppliedAt) {
                  axios
                    .put(
                      `http://localhost:5000/api/credits/${selectedCredit._id}/overdue`,
                      {
                        payable: calc.newTotal,
                        balancePayable: calc.newTotal,
                        interest: `${calc.newRate}%`,
                        lastInterestAppliedAt: new Date().toISOString(),
                      },
                    )
                    .then(() => {
                      fetchCredits();
                      setSelectedCredit((prev) => ({
                        ...prev,
                        ...updatedCredit,
                      }));
                    })
                    .catch((err) =>
                      console.error("Failed to update overdue credit:", err),
                    );
                }
              }

              return (
                <>
                  {/* ====== 5-DAY NOTIFICATION ====== */}
                  {fiveDayNotification}

                  {/* Top Details */}
                  <div className="grid grid-cols-2 gap-10 text-sm">
                    {/* Left */}
                    <div className="space-y-3">
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {updatedCredit.name}
                      </p>
                      <p>
                        <span className="font-semibold">Received Date:</span>{" "}
                        {formatDate(updatedCredit.received)}
                      </p>
                      <p>
                        <span className="font-semibold">Next Due Date:</span>{" "}
                        {formatDate(updatedCredit.due)}
                      </p>
                      <p></p>
                      <p>
                        <span className="font-semibold">Amount Received:</span>{" "}
                        ₹{updatedCredit.amount}
                      </p>
                      <p>
                        <span className="font-semibold">Rate of Interest:</span>{" "}
                        {updatedCredit.originalInterestRate ||
                          updatedCredit.interest}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="space-y-3">
                      <p>
                        <span className="font-semibold">
                          Total Payable Amount:
                        </span>{" "}
                   ₹{calc.latestAmount}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Total Paid Amount:
                        </span>{" "}
                        <span className="text-green-600 ml-2">
                          ₹{updatedCredit.totalPaid || 0}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">
                          Balance Payable Amount:
                        </span>{" "}
                        <span className="text-red-500 ml-2">
                         ₹{calc.latestAmount}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Payment History */}
                  <h3 className="mt-6 font-semibold">Payment History</h3>
                  <div className="border border-yellow-400 rounded-md mt-3">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-gray-50">
                        <tr className="text-left">
                          <th className="p-3">Sl.no</th>
                          <th>Date</th>
                          <th>Amount Paid</th>
                          <th>Amount Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updatedCredit.payments?.length > 0 ? (
                          (() => {
                            let balance =
                              calculateMonthlyCompound(
                                updatedCredit,
                              ).latestAmount;

                            return updatedCredit.payments.map((p, i) => {
                              balance = balance - p.amountPaid;

                              return (
                                <tr
                                  key={i}
                                  className="border-b last:border-b-0"
                                >
                                  <td className="p-3">{i + 1}</td>
                                  <td>{formatDate(p.paidAt)}</td>
                                  <td>₹{p.amountPaid}</td>
                                  <td>₹{calc.latestAmount}</td>
                                </tr>
                              );
                            });
                          })()
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-4 text-gray-400"
                            >
                              No Payment History
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ====== OVERDUE PANEL (SHOWN ONLY AFTER DUE DATE) ====== */}
                  {isOverdue &&
                    (() => {
                      const calc = calculateMonthlyCompound(updatedCredit);

                      return (
                        <div className="mt-4 text-red-600 text-sm font-medium border-t pt-3 flex justify-between">
                          {/* LEFT SIDE */}
                          <div>
                            <p>
                              ⚠ Due date passed. Interest increases every month.
                            </p>

                            <p>
                              Old Interest Rate :{" "}
                              {updatedCredit.originalInterestRate ||
                                updatedCredit.interest}
                            </p>

                            <p>
                              New Interest Rate :{" "}
                              {updatedCredit.originalInterestRate ||
                                updatedCredit.interest}{" "}
                              x {calc.months + 1}
                            </p>

                            <p className="font-semibold">
                              Current Payable Amount : ₹{calc.latestAmount}
                            </p>
                          </div>

                          {/* RIGHT SIDE */}
                          <div className="text-left">
                            <p className="font-semibold">Monthly Calculation</p>

                            {calc.rows.map((r, i) => (
                              <p key={i}>
                                {r.label} → Interest {r.rate}% → Amount ₹
                                {r.amount}
                              </p>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                  {/* Add Payment */}
                  {updatedCredit.status !== "paid" && (
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => {
                          setPaidAmount("");
                          setShowPaymentModal(true);
                        }}
                        className="text-blue-600 text-sm font-medium"
                      >
                        + Add Payment
                      </button>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setShowPaymentModal(false);
                      }}
                      className="text-red-500"
                    >
                      Discard
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[60]">
          <div className="bg-white w-[420px] rounded-lg shadow-lg p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">
              Edit Amount to be Paid
            </h2>

            {/* Input */}
            <div className="mb-6">
              <label className="text-sm text-blue-600">Amount Paid Now</label>

              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full border border-blue-500 rounded p-3 mt-1 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-red-500"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  savePayment();
                }}
                className="bg-yellow-400 px-4 py-2 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credits;

// import React from "react";
// import {
//   FaArrowLeft,
//   FaPlus,
//   FaEye,
//   FaEdit,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Credits = () => {
//   const navigate = useNavigate();

//   const credits = [
//     {
//       id: 1,
//       name: "Deva",
//       received: "06/10/2025",
//       due: "06/11/2025",
//       amount: 10000,
//       interest: "10%",
//       total: 11000,
//       payable: 10500,
//       status: "unpaid",
//     },
//     {
//       id: 2,
//       name: "Suresh",
//       received: "05/10/2025",
//       due: "06/11/2025",
//       amount: 100000,
//       interest: "12%",
//       total: 112000,
//       payable: 107500,
//       status: "unpaid",
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="border rounded-xl border-yellow-400 p-5 bg-white">
//         {/* Header */}

//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-4">
//             <FaArrowLeft className="cursor-pointer text-xl" />
//             <h2 className="text-xl font-semibold">Credits</h2>

//             <div className="bg-gray-100 px-4 py-1 rounded">
//               Date: 06/10/2025
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <input type="date" className="border p-2 rounded" />

//             <input type="date" className="border p-2 rounded" />

//             <input
//               type="text"
//               placeholder="Search..."
//               className="border p-2 rounded"
//             />

//             <button
//               onClick={() => navigate("/add-credit")}
//               className="bg-yellow-400 px-4 py-2 rounded flex items-center gap-2"
//             >
//               <FaPlus />
//               Add Credits
//             </button>
//           </div>
//         </div>

//         {/* Table */}

//         <table className="w-full text-sm">
//           <thead className="border-b">
//             <tr className="text-left">
//               <th className="py-3">Sl No.</th>
//               <th>Name</th>
//               <th>Received Date</th>
//               <th>Due Date</th>
//               <th>Amount</th>
//               <th>Interest</th>
//               <th>Total Amount</th>
//               <th>Amount to be paid</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {credits.map((item, index) => (
//               <tr key={item.id} className="border-b">
//                 <td className="py-3">{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.received}</td>
//                 <td>{item.due}</td>
//                 <td>{item.amount}</td>
//                 <td>{item.interest}</td>
//                 <td>{item.total}</td>
//                 <td>{item.payable}</td>

//                 <td
//                   className={
//                     item.status === "paid" ? "text-green-600" : "text-red-500"
//                   }
//                 >
//                   {item.status}
//                 </td>

//                 <td className="flex gap-3 py-3">
//                   <FaEye className="text-blue-500 cursor-pointer" />

//                   {item.status !== "paid" && (
//                     <FaEdit className="text-yellow-500 cursor-pointer" />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}

//         <div className="flex justify-center items-center gap-4 mt-5">
//           <FaChevronLeft className="cursor-pointer text-yellow-500" />

//           <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//             1
//           </div>

//           <FaChevronRight className="cursor-pointer text-yellow-500" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Credits;

import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaEye,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Credits = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [credits, setCredits] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
const [showPaymentModal, setShowPaymentModal] = useState(false);
  useEffect(() => {
    if (location.state) {
      setCredits((prev) => [...prev, location.state]);
    }
  }, [location.state]);
  return (
    <div className="p-6">
      <div className="border rounded-xl border-yellow-400 p-5 bg-white">
        {/* Header */}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <FaArrowLeft className="cursor-pointer text-xl" />
            <h2 className="text-xl font-semibold">Credits</h2>

            <div className="bg-gray-100 px-4 py-1 rounded">
              Date: 06/10/2025
            </div>
          </div>

          <div className="flex gap-3">
            <input type="date" className="border p-2 rounded" />
            <input type="date" className="border p-2 rounded" />

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
                <tr key={index} className="border-b">
                  <td className="py-3">{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.received}</td>
                  <td>{item.due}</td>
                  <td>{item.amount}</td>
                  <td>{item.interest}</td>
                  <td>{item.total}</td>
                  <td>{item.payable}</td>

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
                        setShowDetailsModal(true);
                      }}
                    />

                    {/* Pen Button */}
                    {item.status !== "paid" && (
                      <FaEdit
                        className="text-yellow-500 cursor-pointer"
                        onClick={() => {
                          setSelectedCredit(item);
                          setShowEditModal(true);
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

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[900px] rounded-lg border-2 border-yellow-400 p-6">
            {/* Title */}
            <h2 className="text-lg font-semibold">Credit Details</h2>

            <hr className="my-4" />

            {/* Top Details */}
            <div className="grid grid-cols-2 gap-10 text-sm">
              {/* Left */}
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedCredit?.name}
                </p>

                <p>
                  <span className="font-semibold">Received Date:</span>{" "}
                  {selectedCredit?.received}
                </p>

                <p>
                  <span className="font-semibold">Next Due Date:</span>{" "}
                  {selectedCredit?.due}
                </p>

                <p>
                  <span className="font-semibold">Amount Received:</span> ₹
                  {selectedCredit?.amount}
                </p>

                <p>
                  <span className="font-semibold">Rate of Interest:</span>{" "}
                  {selectedCredit?.interest}
                </p>
              </div>

              {/* Right */}
              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Total Payable Amount:</span>
                  <span className="text-red-500 ml-2">₹11000</span>
                </p>

                <p>
                  <span className="font-semibold">Total Paid Amount:</span>
                  <span className="text-green-600 ml-2">₹500</span>
                </p>

                <p>
                  <span className="font-semibold">Balance Payable Amount:</span>
                  <span className="text-red-500 ml-2">₹10500</span>
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
                  <tr>
                    <td className="p-3">1</td>
                    <td>06/10/2025</td>
                    <td>₹500</td>
                    <td>₹10500</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Add Payment */}
            {selectedCredit?.status !== "paid" && (
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
          </div>
        </div>
      )}

      {/* ================= CREDIT DETAILS MODAL ================= */}

      {showDetailsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-[800px] rounded-lg border-2 border-yellow-400 p-6">
            <h2 className="text-lg font-semibold mb-4">Credit Details</h2>

            <hr className="mb-5" />

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>
                  <b>Name:</b>
                </p>

                <p>
                  <b>Received Date:</b>
                </p>

                <p>
                  <b>Next Due Date:</b>
                </p>

                <p>
                  <b>Amount Received:</b>
                </p>

                <p>
                  <b>Rate of Interest:</b>
                </p>
              </div>

              <div className="space-y-2">
                <p>
                  <b>Total Payable Amount:</b>
                </p>

                <p>
                  <b>Total Paid Amount:</b>
                </p>

                <p>
                  <b>Balance Payable Amount:</b>
                </p>
              </div>
            </div>

            <h3 className="mt-6 font-semibold">Payment History</h3>

            <div className="border border-yellow-400 rounded mt-3">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="p-2 text-left">Sl.no</th>
                    <th>Date</th>
                    <th>Amount Paid</th>
                    <th>Amount Balance</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      No Payment History
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-red-500"
              >
                Discard
              </button>
            </div>
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
        <label className="text-sm text-blue-600">
          Amount Paid Now
        </label>

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
    console.log("Paid Amount:", paidAmount);
    setShowPaymentModal(false);
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

// import React, { useState, useEffect } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";


// const AddCredit = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     agent: "",
//     date: "",
//     dueDate: "",
//     total: "",
//     interest: "",
//     payable: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

// const handleSubmit = (e) => {
//   e.preventDefault();

//   const newCredit = {
//     name: form.agent,
//     received: form.date,
//     due: form.dueDate,
//     amount: form.total,
//     interest: form.interest + "%",
//     total: form.total,
//     payable: form.payable,
//     status: "unpaid",
//   };

//   navigate("/credits", { state: newCredit });
// };

  

// useEffect(() => {
//   if (location.state) {
//     setCredits((prev) => [...prev, location.state]);
//   }
// }, [location.state]);

//   return (
//     <div className="p-6">
//       <div className="border rounded-xl border-yellow-400 p-6 bg-white">
//         {/* Header */}

//         <div className="flex items-center gap-3 mb-6">
//           <FaArrowLeft
//             className="cursor-pointer"
//             onClick={() => navigate("/credits")}
//           />

//           <h2 className="text-lg font-semibold">Add Credits</h2>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-6">
//             {/* Agent */}

//             <div>
//               <label className="block mb-2">Agent Name:</label>

//               <input
//                 type="text"
//                 name="agent"
//                 value={form.agent}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Date */}

//             <div>
//               <label className="block mb-2">Date:</label>

//               <input
//                 type="date"
//                 name="date"
//                 value={form.date}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Next Due Date */}

//             <div>
//               <label className="block mb-2">Next Due Date:</label>

//               <input
//                 type="date"
//                 name="dueDate"
//                 value={form.dueDate}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Total Amount */}

//             <div>
//               <label className="block mb-2">Total Amount:</label>

//               <input
//                 type="number"
//                 name="total"
//                 value={form.total}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Interest */}

//             <div>
//               <label className="block mb-2">Interest in %:</label>

//               <input
//                 type="number"
//                 name="interest"
//                 value={form.interest}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             {/* Amount Payable */}

//             <div>
//               <label className="block mb-2">Amount Payable:</label>

//               <input
//                 type="number"
//                 name="payable"
//                 value={form.payable}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//           </div>

//           {/* Buttons */}

//           <div className="flex justify-end gap-6 mt-10">
//             <button
//               type="button"
//               onClick={() => navigate("/credits")}
//               className="text-red-500"
//             >
//               Discard
//             </button>

//             <button type="submit" className="bg-yellow-400 px-8 py-2 rounded">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCredit;


import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddCredit = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    agent: "",
    date: "",
    dueDate: "",
    total: "",
    interest: "",
    payable: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCredit = {
      name: form.agent,
      received: form.date,
      due: form.dueDate,
      amount: form.total,
      interest: form.interest + "%",
      total: form.total,
      payable: form.payable,
      status: "unpaid",
    };

    navigate("/credits", { state: newCredit });
  };

  return (
    <div className="p-6">
      <div className="border rounded-xl border-yellow-400 p-6 bg-white">
        {/* Header */}

        <div className="flex items-center gap-3 mb-6">
          <FaArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/credits")}
          />

          <h2 className="text-lg font-semibold">Add Credits</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Agent */}

            <div>
              <label className="block mb-2">Agent Name:</label>

              <input
                type="text"
                name="agent"
                value={form.agent}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Date */}

            <div>
              <label className="block mb-2">Date:</label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Next Due Date */}

            <div>
              <label className="block mb-2">Next Due Date:</label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Total Amount */}

            <div>
              <label className="block mb-2">Total Amount:</label>

              <input
                type="number"
                name="total"
                value={form.total}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Interest */}

            <div>
              <label className="block mb-2">Interest in %:</label>

              <input
                type="number"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Amount Payable */}

            <div>
              <label className="block mb-2">Amount Payable:</label>

              <input
                type="number"
                name="payable"
                value={form.payable}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-6 mt-10">
            <button
              type="button"
              onClick={() => navigate("/credits")}
              className="text-red-500"
            >
              Discard
            </button>

            <button type="submit" className="bg-yellow-400 px-8 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddCredit;
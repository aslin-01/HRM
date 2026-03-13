import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editEmployee = location.state || null;

  const [showAgentModal, setShowAgentModal] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agents, setAgents] = useState([]);

  const [employee, setEmployee] = useState({
    _id: editEmployee?._id || null,
    employeeId: editEmployee?.employeeId || "",
    name: editEmployee?.name || "",
    dob: editEmployee?.dob ? editEmployee.dob.split("T")[0] : "",
    age: editEmployee?.age || "",
    gender: editEmployee?.gender || "",
    phone: editEmployee?.phone || "",
    address: editEmployee?.address || "",
    agent: editEmployee?.agent || "",
  });

  const API = "http://localhost:5000/api/employees";

  // const generateEmployeeId = async () => {
  //   try {
  //     const res = await axios.get(API);

  //     if (res.data.length === 0) {
  //       setEmployee(prev => ({ ...prev, employeeId: "01" }));
  //       return;
  //     }

  //     const lastEmployee = res.data[res.data.length - 1];

  //     const nextId = String(parseInt(lastEmployee.employeeId) + 1).padStart(2, "0");

  //     setEmployee(prev => ({
  //       ...prev,
  //       employeeId: nextId
  //     }));

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchNextEmployeeId = async () => {
    try {
      const res = await axios.get(API);

      if (res.data.length === 0) {
        setEmployee((prev) => ({ ...prev, employeeId: "01" }));
        return;
      }

      const latest = res.data[0];

      const nextId = String(Number(latest.employeeId) + 1).padStart(2, "0");

      setEmployee((prev) => ({
        ...prev,
        employeeId: nextId,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const birthDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setEmployee({
        ...employee,
        dob: value,
        age: age,
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleSaveAgent = () => {
    if (!agentName) return;

    if (!agents.includes(agentName)) {
      setAgents([...agents, agentName]);
    }

    setEmployee({
      ...employee,
      agent: agentName,
    });

    setShowAgentModal(false);
    setAgentName("");
  };
  const handleContinue = () => {
    // Check required fields
    if (!employee.employeeId || !employee.name || !employee.dob) {
      alert("Employee ID, Name, and DOB are required");
      return;
    }

    // Navigate to EmployeeDetails page and pass all input values
    navigate("/workers/emppreview", { state: employee });
  };

  useEffect(() => {
    if (!editEmployee) {
      fetchNextEmployeeId();
    } else {
      setEmployee({
        _id: editEmployee._id,
        employeeId: editEmployee.employeeId,
        name: editEmployee.name,
        dob: editEmployee.dob ? editEmployee.dob.split("T")[0] : "",
        age: editEmployee.age,
        gender: editEmployee.gender,
        phone: editEmployee.phone,
        address: editEmployee.address,
        agent: editEmployee.agent,
      });

      if (editEmployee.agent) {
        setAgents([editEmployee.agent]);
      }
    }
  }, [editEmployee]);

  return (
    <div className="min-h-screen relative">
      <div className="border border-yellow-400 rounded-xl p-8 bg-white">
        <h2 className="text-xl font-semibold mb-8">New Employee</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Employee ID */}
          <div>
            <label className="block text-sm mb-2">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={employee.employeeId}
              readOnly
              className="w-full border rounded-lg p-3 outline-none bg-gray-100"
            />
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-sm mb-2">Employee Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={employee.dob}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={employee.age}
              readOnly
              className="w-full border rounded-lg p-3 outline-none bg-gray-100"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-2">Gender</label>
            <select
              name="gender"
              value={employee.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-2">Address</label>
            <textarea
              rows="6"
              name="address"
              value={employee.address}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            ></textarea>
          </div>

          {/* Agent */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm mb-2">Agent</label>

              <span
                onClick={() => setShowAgentModal(true)}
                className="text-blue-500 text-sm cursor-pointer"
              >
                + Add Agent
              </span>
            </div>

            <select
              name="agent"
              value={employee.agent || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none"
            >
              <option value="">Select Agent</option>

              {agents.map((agent, index) => (
                <option key={index} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleContinue}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-10 py-3 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl border border-yellow-400 w-[450px] shadow-xl">
            <h3 className="text-lg font-semibold mb-6">Add New Agent</h3>

            <input
              type="text"
              placeholder="Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none mb-6"
            />

            <div className="flex justify-end gap-3">
              {/* <button
                onClick={() => setShowAgentModal(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button> */}

              <button
                onClick={handleSaveAgent}
                className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-semibold"
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

export default AddEmployee;

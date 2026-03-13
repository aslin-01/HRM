import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import axios from "axios";

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = location.state;

  const API = "http://localhost:5000/api/employees";

  const checkDuplicateId = async (employeeId) => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      return res.data.some((emp) => emp.employeeId === employeeId);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // SAVE EMPLOYEE
  const handleSave = async () => {
    if (!employee?.employeeId || !employee?.name) {
      alert("Employee ID and Name are required");
      return;
    }

    try {
      if (employee._id) {
        await axios.put(`${API}/${employee._id}`, employee);
        alert("Employee updated successfully");
      } else {
        const duplicate = await checkDuplicateId(employee.employeeId);
        if (duplicate) {
          alert(`Employee ID ${employee.employeeId} already exists!`);
          return;
        }

        await axios.post(API, employee);
        alert("Employee created successfully");
      }

      navigate("/workers");
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // DELETE EMPLOYEE
  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${employee._id}`);
      alert("Employee deleted successfully");

      navigate("/workers", { replace: true, state: null });
    } catch (error) {
      console.error(error);
    }
  };
  // EDIT EMPLOYEE
  const handleEdit = () => {
    navigate("/workers/add", { state: employee });
  };

  return (
    <div className="min-h-screen">
      {/* Back */}
      {/* <button onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft size={24} />
      </button> */}
      <div onClick={() => navigate(-1)} className="mb-4 text-xl cursor-pointer">
        ←
      </div>

      <div className="border border-yellow-400 rounded-xl p-8 bg-white">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg font-semibold">New Employee</h2>

          <div className="flex gap-6 items-center">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-500"
            >
              <Trash2 size={18} />
              Delete
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-2 text-gray-600"
            >
              <Pencil size={18} />
              Edit
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-6 text-sm">
          <p className="font-medium">Employee ID</p>
          <p>{employee?.employeeId}</p>

          <p className="font-medium">Employee Name</p>
          <p>{employee?.name}</p>

          <p className="font-medium">Date of Birth</p>
          <p>{employee?.dob}</p>

          <p className="font-medium">Age</p>
          <p>{employee?.age}</p>

          <p className="font-medium">Sex</p>
          <p>{employee?.gender}</p>

          <p className="font-medium">Address</p>
          <p>{employee?.address}</p>

          <p className="font-medium">Phone Number</p>
          <p>{employee?.phone}</p>

          <p className="font-medium">Agent</p>
          <p>{employee?.agent}</p>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={handleSave}
            className="bg-yellow-400 hover:bg-yellow-500 px-12 py-3 rounded-lg font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

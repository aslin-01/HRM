import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNav from "./Frontend/Components/TopNav.jsx";
import SideNav from "./Frontend/Components/SideNav.jsx";

import AddEmployee from "./Frontend/Pages/Employees/AddEmployee.jsx";
import EmployeeDetails from "./Frontend/Pages/Employees/EmployeeDetails.jsx";
import Employees from "./Frontend/Pages/Employees/Employees.jsx";
import Attendance from "./Frontend/Pages/Attendance/Attendance.jsx";
import Payroll from "./Frontend/Pages/Payroll/Payroll.jsx";
import Credits from "./Frontend/Pages/Credit/Credits.jsx"
import AddCredit from "./Frontend/Pages/Credit/AddCredit.jsx"

function App() {
  return (
    <BrowserRouter>
      {/* Top Navigation */}
      <TopNav />

      <div className="flex">
        {/* Sidebar */}
        <SideNav />

        {/* Page Content */}
        <div className="flex-1 p-6 bg-[#f4f1e9] min-h-screen">
          <Routes>
            {/* Employees List */}
            <Route path="/workers" element={<Employees />} />

            {/* Add Employee */}
            <Route path="/workers/add" element={<AddEmployee />} />

            {/* Employee Preview */}
            <Route path="/workers/emppreview" element={<EmployeeDetails />} />
            <Route path="/attendance" element={<Attendance />} />
            {/* Default Page */}
            <Route path="/payroll" element={<Payroll />} />

            <Route path="/credits" element={<Credits />} />
            <Route path="/add-credit" element={<AddCredit />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

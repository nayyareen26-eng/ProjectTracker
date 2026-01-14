import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DepartmentList from "./components/DepartmentList";
import TeamList from "./pages/TeamList";
import Projects from "./pages/Projects";
import ProjectDetail from "./components/ProjectDetail"; 
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Redirect OLD plural route */}
        <Route path="/departments" element={<Navigate to="/department" replace />}/>
       {/* Departments list */}
        <Route path="/department" element={<DepartmentList />}/>

        {/* Teams inside department */}
        <Route
          path="/department/:departmentId/team" element={<TeamList />} />
        
        {/*Projects inside department  */}
        <Route path="/department/:departmentId/team/:teamId/project" element={<Projects />}/>
        
        <Route path="/department/:departmentId/team/:teamId/project/:projectId" element={<ProjectDetail />}/>
        {/*ProjectDetails */}
         <Route path="/project/:projectId" element={<ProjectDetail />}/>
        
        {/*Admin  */}
        <Route
 path="/admin-dashboard"
 element={
   <ProtectedRoute>
     <AdminRoute>
        <AdminDashboard/>
     </AdminRoute>
   </ProtectedRoute>
 }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

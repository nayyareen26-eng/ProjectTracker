import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const role = localStorage.getItem("job_profile");

  if (role !== "ADMIN") {
    return <Navigate to="/department" />;
  }

  return children;
};

export default AdminRoute;

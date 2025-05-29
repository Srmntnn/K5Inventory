import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Users from "@/screens/dashboard/User";
import AllItems from "@/screens/dashboard/AllItems";
import AddItem from "@/screens/dashboard/AddItem";
import AddBrands from "@/screens/dashboard/manufacturer/AddBrands";
import Brands from "@/screens/dashboard/manufacturer/Brands";
import Location from "@/screens/dashboard/locations/Location";
import AddLocation from "@/screens/dashboard/locations/AddLocation";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ForgotPassword from "@/pages/ForgotPassword";
import DashboardLayout from "@/layout/DashboardLayout";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";
import MyBorrowRequests from "@/pages/MyBorrowRequests";
import BorrowRequest from "@/screens/dashboard/BorrowRequest";
import HomeDashboard from "@/screens/dashboard/HomeDashboard";
import NOtFound from "@/pages/NOTFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/my-request",
    element: <MyBorrowRequests />,
  },
  {
    path: "*",
    element: <NOtFound />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedAdminRoute>
        <DashboardLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { path: "home", element: <HomeDashboard /> },
      { path: "users", element: <Users /> },
      { path: "all-items", element: <AllItems /> },
      { path: "add-item", element: <AddItem /> },
      { path: "borrow-request", element: <BorrowRequest /> },
      { path: "add-brands", element: <AddBrands /> },
      { path: "brands", element: <Brands /> },
      { path: "locations", element: <Location /> },
      { path: "add-locations", element: <AddLocation /> },
    ],
  },
]);

export default router;

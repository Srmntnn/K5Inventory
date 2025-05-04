import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/layout/DashboardLayout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
// import ResetPassword from "@/pages/resetPassword";
// import ForgotPassword from "@/pages/forgotPassword";
import Users from "@/screens/dashboard/User";
import AllItems from "@/screens/dashboard/AllItems";
import AddItem from "@/screens/dashboard/AddItem";
import AddBrands from "@/screens/dashboard/manufacturer/AddBrands";
import Brands from "@/screens/dashboard/manufacturer/Brands";
import Location from "@/screens/dashboard/locations/Location";
import AddLocation from "@/screens/dashboard/locations/AddLocation";

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
  //   {
  //     path: "/resetPassword/:token",
  //     element: <ResetPassword />,
  //   },
  //   {
  //     path: "/forgotPassword",
  //     element: <ForgotPassword />,
  //   },

  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "all-items",
        element: <AllItems />,
      },
      {
        path: "add-item",
        element: <AddItem />,
      },
      {
        path: "add-brands",
        element: <AddBrands />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "locations",
        element: <Location />,
      },
      {
        path: "add-locations",
        element: <AddLocation />,
      }
    ],
  },
]);

export default router;

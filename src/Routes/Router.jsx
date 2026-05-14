


import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/AuthPages/Login";
import Register from "../Pages/AuthPages/Register";
import ReportIssue from "../Pages/Issues/ReportIssue";
import MyIssues from "../Pages/Issues/MyIssues";
import IssueDetails from "../Pages/Issues/IssueDetails";
import PrivateRoute from "./PrivateRoute";
import AllIssues from "../Pages/Issues/AllIssues";
import BoostPayment from "../Pages/Payment/BoostPayment";
import BoostSuccess from "../Pages/Payment/BoostSuccess";
import BoostCancel from "../Pages/Payment/BoostCancel";
import Profile from "../Pages/Home/Profile";
import SubscribeSuccess from "../Pages/Home/Subscribe/SubscribeSuccess";
import SubscribeCancel from "../Pages/Home/Subscribe/SubscribeCancel";

// Dashboard imports
import DashboardLayout from "../Layouts/DashboardLayout";
import AdminDashboard from "../Layouts/DashboardComponent/AdminDashboard";
import StaffDashboard from "../Layouts/DashboardComponent/StaffDashboard";
import CitizenDashboard from "../Layouts/DashboardComponent/CitizenDashboard";
import RoleRoute from "./RoleRoute";
import BeAStaff from "../Pages/Home/Staff/BeAStaff";
import AllIssuesAdmin from "../Pages/Home/Admin/AllIssuesAdmin";
import Coverage from "../Pages/Home/Coverage/Coverage";
import StaffAssignedIssue from "../Pages/Home/Staff/StaffAssignedIssue";
import DashboardHome from "../Layouts/DashboardComponent/DashboardHome";
import StaffManageMent from "../Pages/Home/Admin/StaffManageMent";
import UserManagement from "../Pages/Home/Admin/UserManagement";
import PatmentLogs from "../Pages/Home/Admin/PatmentLogs";
import StaffCreation from "../Pages/Home/Admin/StaffCreation";
import StaffPaymentLog from "../Pages/Home/Coverage/StaffPaymentLog";
import ErrorPage from "../Pages/Home/ErrorPage";
import EditIssue from "../Pages/Issues/EditIssue";



export default router;
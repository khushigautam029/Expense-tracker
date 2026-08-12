import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { NotificationProvider } from "./context/NotificationContext";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notification";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transaction";
import VerifyOTP from "./pages/VerifyOTP";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        dark:bg-slate-900
        transition-colors
        duration-300
    "
    >  {/* Pass state and setter to Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Dynamic margin changes based on collapsed state */}
      <div className={`transition-all duration-300 ${collapsed ? "ml-[76px]" : "ml-[240px]"}`}>
        <Navbar collapsed={collapsed} />
        <main className="min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Profile */}
          <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          {/* Income */}
          <Route path="/income" element={<Layout><ProtectedRoute><Income /></ProtectedRoute></Layout>} />
          {/* Expenses */}
          <Route path="/expenses" element={<Layout><ProtectedRoute><Expenses /></ProtectedRoute></Layout>} />
          {/* Reports */}
          <Route path="/reports" element={<Layout><ProtectedRoute><Reports /></ProtectedRoute></Layout>} />
          {/* Notifications */}
          <Route path="/notifications" element={<Layout><ProtectedRoute><Notifications /></ProtectedRoute></Layout>} />
          {/* Transaction */}
          <Route path="/transactions" element={<Layout> <ProtectedRoute> <Transactions /> </ProtectedRoute></Layout>}/>
          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;

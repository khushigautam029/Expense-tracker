import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Reports from "./pages/Reports";


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />
      <main className="ml-[240px] min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to= "/login" replace/>}/>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Profile */}
        <Route path="/profile" element={ <Layout> <ProtectedRoute> <Profile /> </ProtectedRoute> </Layout>}/>
        {/* Dashboard */}
        <Route path="/dashboard" element={ <Layout> <ProtectedRoute> <Dashboard /> </ProtectedRoute> </Layout>}/>
        {/* Income */}
        <Route path="/income" element={<Layout> <ProtectedRoute> <Income /> </ProtectedRoute> </Layout>} />
        {/* Expenses */}
        <Route path="/expenses" element={ <Layout> <ProtectedRoute> <Expenses /> </ProtectedRoute> </Layout>}/>
        {/* Reports*/}
        <Route path="/reports" element={ <Layout> <ProtectedRoute> <Reports /> </ProtectedRoute> </Layout>}/>
        {/* Not found */}
        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Customers from "./pages/customer/Customers";
import Orders from "./pages/order/Orders";
import Category from "./pages/category/Category";
import Products from "./pages/product/Products";
import Dashboard from "./pages/dashboard/Dashboard";
import Casher from "./pages/casher/Casher";
import Settings from "./pages/setting/Settings";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";

// A wrapper component to conditionally show the sidebar
const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const isCasherPage = location.pathname === "/casher";

  return (
    <>
      {!isCasherPage && <Sidebar onLogout={onLogout} />}
      <div
        className={
          !isCasherPage
            ? "ml-64 p-6 flex-1 min-h-screen bg-gray-100"
            : "flex-1 min-h-screen"
        }
      >
        {children}
      </div>
    </>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Function to handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignUp onLogin={handleLogin} />
            )
          }
        />

        {/* Casher route - accessible with or without authentication */}
        <Route
          path="/casher"
          element={
            <Layout onLogout={handleLogout}>
              <Casher />
            </Layout>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

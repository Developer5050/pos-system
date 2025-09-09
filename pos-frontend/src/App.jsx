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
import Cashier from "./pages/cashier/Cashier";
import Settings from "./pages/setting/Settings";
import SignUp from "./pages/signup/SignUp";
import Login from "./pages/login/Login";
import Supplier from "./pages/supplier/Supplier";
import ProductListing from "./pages/productListing/ProductListing";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout wrapper to conditionally show sidebar
const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const isCashierPage = location.pathname === "/cashier";

  return (
    <>
      {!isCashierPage && <Sidebar onLogout={onLogout} />}
      <div
        className={
          !isCashierPage
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

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Show loading while checking authentication
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
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/cashier" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/cashier" replace />
            ) : (
              <SignUp onLogin={handleLogin} />
            )
          }
        />

        {/* Cashier route (protected) */}
        <Route
          path="/cashier"
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Cashier />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected admin/dashboard routes */}
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
                  <Route path="/suppliers" element={<Supplier />} />
                  <Route
                    path="/suppliers/productListing"
                    element={<ProductListing />}
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {/* 👇 ToastContainer yahan add karo */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
};

export default App;

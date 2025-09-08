import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaShoppingCart, FaBox, FaUsers, FaCog } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { AiFillDashboard } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);

  const toggleSuppliers = () => {
    setIsSuppliersOpen(!isSuppliersOpen);
  };

  const handleLogout = async () => {
    try {
      // Show loading toast
      const toastId = toast.loading("Logging out...", {
        position: "top-right",
      });

      // Call logout API
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/user/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");

      // Update toast to success
      toast.update(toastId, {
        render: "Logout successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Update auth state in App.jsx
      if (onLogout) onLogout();

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);

      // Show error toast
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="w-64 bg-blue-800 text-white h-screen fixed top-0 left-0 font-ubuntu">
      <div className="p-4 text-2xl font-bold border-b border-blue-700">
        <i className="fas fa-cash-register mr-1"></i> POS System
      </div>
      <nav className="p-2 mt-2">
        <ul>
          <li className="mb-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <AiFillDashboard className="mr-3 text-xl" /> Dashboard
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/category"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <BiSolidCategory className="mr-3 text-xl" /> Category
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaShoppingCart className="mr-3 text-xl" /> Products
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaBox className="mr-3 text-xl" /> Orders
            </NavLink>
          </li>

          <li className="mb-3">
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaUsers className="mr-3 text-xl" /> Customers
            </NavLink>
          </li>

          <li className="mb-3">
            <div className="flex flex-col">
              <div
                onClick={toggleSuppliers}
                className="flex items-center p-1.5 rounded-lg cursor-pointer hover:bg-blue-700 hover:text-white"
              >
                <i className="fa-solid fa-truck mr-2"></i> Suppliers
                <i
                  className={`ml-auto transition-transform ${
                    isSuppliersOpen ? "rotate-90" : ""
                  } fa-solid fa-chevron-right`}
                ></i>
              </div>

              {/* Nested Links */}
              {isSuppliersOpen && (
                <ul className="ml-6 mt-1">
                  <li className="mb-1">
                    <NavLink
                      to="/suppliers"
                      end
                      className={({ isActive }) =>
                        `flex items-center p-1.5 rounded-lg ${
                          isActive
                            ? "bg-blue-700 text-white"
                            : "hover:bg-blue-700 hover:text-white"
                        }`
                      }
                    >
                      Suppliers Data
                    </NavLink>
                  </li>
                  <li className="mb-1">
                    <NavLink
                      to="/suppliers/transaction"
                      className={({ isActive }) =>
                        `flex items-center p-1.5 rounded-lg ${
                          isActive
                            ? "bg-blue-700 text-white"
                            : "hover:bg-blue-700 hover:text-white"
                        }`
                      }
                    >
                      Transaction
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </li>

          <li className="mb-3">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-1.5 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaCog className="mr-3 text-xl" /> Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Section at Bottom */}
      <div className="absolute bottom-0 w-full p-2 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 w-full text-left rounded-lg hover:bg-blue-700 hover:text-white transition-colors duration-200"
        >
          <MdLogout className="mr-3 text-xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

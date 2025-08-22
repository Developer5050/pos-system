import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { FaShoppingCart, FaBox, FaUsers, FaCog } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { AiFillDashboard } from "react-icons/ai";

const Sidebar = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="w-64 bg-blue-800 text-white h-screen fixed top-0 left-0 font-ubuntu">
      <div className="p-4 text-2xl font-bold border-b border-blue-700">
        <i className="fas fa-cash-register mr-2"></i> POS System
      </div>
      <nav className="p-3 ">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <AiFillDashboard className="mr-3 text-xl" /> Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/category"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <BiSolidCategory className="mr-3 text-xl" /> Category
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaShoppingCart className="mr-3 text-xl" /> Products
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaBox className="mr-3 text-xl" /> Orders
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
                  isActive
                    ? "bg-blue-700 text-white"
                    : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <FaUsers className="mr-3 text-xl" /> Customers
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center p-2 rounded-lg ${
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
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-700">
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

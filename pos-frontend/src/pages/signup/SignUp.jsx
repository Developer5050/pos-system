import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      console.log("Signup attempted with:", formData);
      // Here you would typically handle the signup logic
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-3.5 px-4 sm:px-6 lg:px-8 font-ubuntu">
      <div className="max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Illustration */}
          <div className="hidden md:block w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-2xl font-bold mb-4">Join Our POS System</h2>
              <p className="mb-8 text-[14px]">
                Streamline your business operations with our powerful
                point-of-sale solution.
              </p>

              <div className="space-y-2 mb-10">
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[14px]">Easy inventory management</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[14px]">Sales analytics & reports</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[14px]">Customer management</span>
                </div>
              </div>

              <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400">
                <p className="text-[14px]">
                  "This POS system transformed how we manage our retail
                  business. Highly recommended!"
                </p>
                <p className="text-[14px] font-semibold mt-2">
                  - Ahmad Shoukat, Owner
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-3/5 py-5 px-6">
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center h-10 w-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full mb-1">
                <svg
                  className="h-8 w-8 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Create Your Account
              </h2>
              <p className="mt-0.5 text-[12px] sm:text-[14px] text-gray-600">
                Start your 14-day free trial. No credit card required.
              </p>
            </div>

            <form className="space-y-1" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-1.5 text-[14px] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-1.5 text-[14px]  border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-black mb-1"
                >
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1.5 text-[14px]  border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Business Inc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <MdOutlineEmail size={16} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-9 px-4 py-1.5 text-[14px]  border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FiPhone size={16} />
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-9 px-4 py-1.5 text-[14px]  border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    {/* Lock Icon */}
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <RiLockPasswordLine size={16} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-10 px-4 py-2 text-[14px]  border border-gray-300 rounded-md focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                    {/* Eye Toggle Icon */}
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500 hover:text-gray-600" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5 text-gray-500 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center ">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  // checked={formData.agreeToTerms}
                  // onChange={handleInputChange}
                  className="h-3 w-3 mt-1.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 mt-1.5 block sm:mt-1 text-[9px] sm:text-sm text-gray-900"
                >
                  I agree to the {""}
                   <a href="#" className="text-blue-600 hover:text-blue-600 hover:underline">
                    Terms of Service {""}
                  </a>
                  and {""}
                  <a href="#" className="text-blue-600 hover:text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 mt-3 border border-transparent text-sm font-medium font-ubuntu rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 ml-1 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

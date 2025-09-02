import React, { useState, useEffect } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    businessName: "My POS Business",
    currency: "USD",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    language: "English",

    // Receipt Settings
    printReceipts: true,
    receiptHeader: "Thank you for your business!",
    receiptFooter: "Returns accepted within 30 days",
    printTaxId: true,
    taxId: "TAX-123456789",

    // Tax Settings
    taxEnabled: true,
    taxRate: 0,
    taxInclusive: false,

    // Payment Settings
    cashPayment: true,
    cardPayment: true,
    digitalWallet: true,
    allowPartialPayments: false,

    // Inventory Settings
    lowStockAlert: true,
    lowStockThreshold: 10,
    allowNegativeInventory: false,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState("");

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Fetch tax settings
        const taxRes = await fetch(
          "http://localhost:5000/api/setting/tax-setting"
        );
        const taxData = await taxRes.json();
        
        // In a real app, you would fetch other settings too
        setSettings((prev) => ({
          ...prev,
          taxEnabled: taxData.taxEnabled,
          taxRate: taxData.taxRate,
          taxInclusive: taxData.taxInclusive,
        }));
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    try {
      // Save tax settings
      const res = await fetch(
        "http://localhost:5000/api/setting/tax-settings-update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taxEnabled: settings.taxEnabled,
            taxRate: Number(settings.taxRate),
            taxInclusive: settings.taxInclusive,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save settings");

      // Save to localStorage for Cashier page
      localStorage.setItem(
        "taxSettings",
        JSON.stringify({
          taxEnabled: settings.taxEnabled,
          taxRate: Number(settings.taxRate),
          taxInclusive: settings.taxInclusive,
        })
      );

      // In a real app, you would save other settings to their respective endpoints
      
      setSaveStatus("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      setSaveStatus("Failed to save settings.");
    }

    setTimeout(() => setSaveStatus(""), 3000);
  };

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "receipt", name: "Receipt", icon: "🧾" },
    { id: "tax", name: "Tax", icon: "💰" },
    { id: "payment", name: "Payment", icon: "💳" },
    { id: "inventory", name: "Inventory", icon: "📦" },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-ubuntu">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Configure your POS system settings
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-md font-medium flex items-center whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-black hover:text-gray-700"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {saveStatus && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  saveStatus.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : saveStatus.includes("Saving")
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {saveStatus}
              </div>
            )}

            {/* General Settings */}
            {activeTab === "general" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={settings.businessName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC-5">EST (UTC-5)</option>
                    <option value="UTC-6">CST (UTC-6)</option>
                    <option value="UTC-7">MST (UTC-7)</option>
                    <option value="UTC-8">PST (UTC-8)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Date Format
                  </label>
                  <select
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            )}

            {/* Receipt Settings */}
            {activeTab === "receipt" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="printReceipts"
                    name="printReceipts"
                    checked={settings.printReceipts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="printReceipts"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Automatically print receipts
                  </label>
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Receipt Header
                  </label>
                  <textarea
                    name="receiptHeader"
                    value={settings.receiptHeader}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-md font-medium text-black mb-2">
                    Receipt Footer
                  </label>
                  <textarea
                    name="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="printTaxId"
                    name="printTaxId"
                    checked={settings.printTaxId}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="printTaxId"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Print Tax ID on receipts
                  </label>
                </div>
                
                {settings.printTaxId && (
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Tax ID
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={settings.taxId}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Tax Settings */}
            {activeTab === "tax" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="taxEnabled"
                    name="taxEnabled"
                    checked={settings.taxEnabled}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="taxEnabled"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Enable tax calculation
                  </label>
                </div>
                {settings.taxEnabled && (
                  <>
                    <div>
                      <label className="block text-md font-medium text-black mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        name="taxRate"
                        value={settings.taxRate}
                        onChange={handleInputChange}
                        min="0"
                        max="30"
                        step="0.1"
                        className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="taxInclusive"
                        name="taxInclusive"
                        checked={settings.taxInclusive}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="taxInclusive"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Prices include tax
                      </label>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cashPayment"
                    name="cashPayment"
                    checked={settings.cashPayment}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="cashPayment"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Accept cash payments
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cardPayment"
                    name="cardPayment"
                    checked={settings.cardPayment}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="cardPayment"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Accept card payments
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="digitalWallet"
                    name="digitalWallet"
                    checked={settings.digitalWallet}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="digitalWallet"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Accept digital wallets (Apple Pay, Google Pay)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowPartialPayments"
                    name="allowPartialPayments"
                    checked={settings.allowPartialPayments}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="allowPartialPayments"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Allow partial payments
                  </label>
                </div>
              </div>
            )}

            {/* Inventory Settings */}
            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockAlert"
                    name="lowStockAlert"
                    checked={settings.lowStockAlert}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="lowStockAlert"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Enable low stock alerts
                  </label>
                </div>
                
                {settings.lowStockAlert && (
                  <div>
                    <label className="block text-md font-medium text-black mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={settings.lowStockThreshold}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full p-2 border rounded-md text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Receive alerts when stock falls below this quantity
                    </p>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowNegativeInventory"
                    name="allowNegativeInventory"
                    checked={settings.allowNegativeInventory}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="allowNegativeInventory"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Allow negative inventory
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  When enabled, sales can be made even when items are out of stock
                </p>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
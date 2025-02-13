import React from "react";

const Header = () =>
  { return (
  <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg">
    <h1 className="text-xl font-bold">Admin Dashboard</h1>
    <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md">
      Logout
    </button>
  </header>
);
  };

export default Header;

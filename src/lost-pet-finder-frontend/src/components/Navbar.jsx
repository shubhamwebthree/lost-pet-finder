import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <a className="text-2xl font-semibold tracking-wide hover:text-gray-200 transition">
          Lost Pet Finder
        </a>
        
      </div>
    </nav>
  );
};

export default Navbar;

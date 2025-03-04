import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/images/Caliber_Logo.jpg" // Path to your logo image in the public folder
          alt="Logo"
          className="h-10 w-10" // Adjust size as needed
        />
        <span className="text-5xl fontfamily-Abhaya font-bold">Caliber Fitness</span>
      </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/Home"
                className="text-lg hover:underline transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="#plans"
                className="text-lg hover:underline transition duration-300"
              >
                Plans
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className="text-lg hover:underline transition duration-300"
              >
                Gallery
              </a>
            </li>
            <li>
              <Link
                to="/Login"
                className="text-lg hover:underline transition duration-300"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

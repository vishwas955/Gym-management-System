import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold">
          <h1>Caliber Fitness</h1>
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

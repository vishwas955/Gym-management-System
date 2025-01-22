import React from 'react'
import "../styles/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className='Nav'>
      <header>
        <div className="logo">
          <h1>Caliber Fitness</h1>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/Home">Home</Link>
            </li>
            <li>
              <Link to="#plans">Plans</Link>
            </li>
            <li>
              <Link to="#gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/Login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  )
}

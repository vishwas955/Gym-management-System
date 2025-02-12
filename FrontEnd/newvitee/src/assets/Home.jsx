import React from "react";
import { Link } from "react-router-dom";
import homeImage from "../images/home.png";

function Home() {
  return (
    <>
      {/* Main Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center h-screen text-center bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${homeImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>
        <h1 className="relative text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in">
          Welcome to <span className="text-yellow-400">Caliber Fitness!</span>
        </h1>
        <p className="relative text-lg md:text-2xl mb-6 animate-slide-in">
          Shape your muscles, unleash your potential.
        </p>
        <Link to="/Registration">
          <button className="relative px-8 py-3 bg-yellow-400 text-gray-900 font-semibold text-lg rounded-lg shadow-lg hover:bg-yellow-500 transition-all duration-300">
            Register Now
          </button>
        </Link>
      </section>

      {/* Why Us Section */}
      <section id="home" className="px-8 py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Why Choose <span className="text-yellow-400">Us?</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At Caliber Fitness, we’re more than just a gym—we’re a community.
            With cutting-edge equipment, expert trainers, and a welcoming environment, 
            we make fitness fun and effective. No matter your level, 
            we’re here to help you succeed!
          </p>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="plans" className="px-8 py-16 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Membership <span className="text-yellow-400">Plans</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Basic Plan",
              features: ["Access to gym facilities"],
              price: "Rs. 1500/month",
            },
            {
              title: "Standard Plan",
              features: ["Access to gym facilities", "Personalized workout plan"],
              price: "Rs. 1700/month",
            },
            {
              title: "Premium Plan",
              features: [
                "Access to gym facilities",
                "Personalized workout plan",
                "1-on-1 coaching sessions",
              ],
              price: "Rs. 2000/month",
            },
          ].map((plan, index) => (
            <div
              key={index}
              className="p-8 bg-white shadow-lg rounded-xl text-center transform hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">{plan.title}</h3>
              <ul className="text-gray-600 space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-yellow-400 font-semibold">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <p className="text-xl font-bold text-gray-900 mb-4">{plan.price}</p>
              <Link to="/Registration">
                <button className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300">
                  Join Now
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="px-8 py-16 bg-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Our Fitness <span className="text-yellow-400">Gallery</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={`https://via.placeholder.com/400?text=Image+${index + 1}`}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center bg-gray-800 text-white py-6">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-bold">Caliber Fitness</span>. All Rights Reserved.
        </p>
      </footer>
    </>
  );
}

export default Home;

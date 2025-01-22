import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <section className="main">
      <h1>Welcome to Caliber Fitness!</h1>
      <p>Shape your muscles with us.</p>
      <Link to="/Registration">
        <button>Register Now</button>
      </Link>
    </section>

    <section id="home">
      <h2>Why Us?</h2>
      <p>
        At Caliber Fitness, we’re more than just a gym—we’re a community focused
        on helping you achieve your fitness goals. With state-of-the-art
        equipment, personalized workout plans, expert trainers, and a welcoming
        environment, we make fitness accessible and enjoyable for everyone.
        Whether you’re a beginner or a seasoned athlete, we provide the tools,
        support, and motivation to help you succeed. Join Caliber Fitness today
        and take the first step toward a healthier, stronger, and more confident
        you.
      </p>
    </section>

    <section id="plans">
      <h2>Membership Plans</h2>
      <div className="plans">
        <div className="plan">
          <h3>Basic Plan</h3>
          <p>Access to gym facilities</p>
          <p>Price: Rs. 1500/month</p>
          <Link to="/Registration">
            <button>Join Now</button>
          </Link>
        </div>
        <div className="plan">
          <h3>Standard Plan</h3>
          <p>Access to gym facilities</p>
          <p>Personalized workout plan</p>
          <p>Price: Rs. 1700/month</p>
          <Link to="/Registration">
            <button>Join Now</button>
          </Link>
        </div>
        <div className="plan">
          <h3>Premium Plan</h3>
          <p>Access to gym facilities</p>
          <p>Personalized workout plan</p>
          <p>1-on-1 coaching sessions</p>
          <p>Price: Rs. 2000/month</p>
          <Link to="/Registration">
            <button>Join Now</button>
          </Link>
        </div>
      </div>
    </section>

    <section id="gallery">
      <div className="gallery-container">
        <h1>Our Fitness Gallery</h1>
        <div className="gallery">
          {[...Array(6)].map((_, index) => (
            <div className="gallery-item" key={index}>
              <img
                src={`https://via.placeholder.com/300`}
                alt={`Gallery Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>

    <footer>
      <p>&copy; 2025 Caliber Fitness. All Rights Reserved.</p>
    </footer>
  </>
  );
}
export default Home;
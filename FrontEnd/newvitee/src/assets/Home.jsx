import React from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useRef } from "react";

function Home() {

  const images = [
    {
      original: "/images/g1.jpg",
      thumbnail: "/images/g1.jpg",
    },
    {
      original: "/images/g2.jpg",
      thumbnail: "/images/g2.jpg",
    },
    {
      original: "/images/g3.jpg",
      thumbnail: "/images/g3.jpg",
    },
    {
      original: "/images/g4.jpg",
      thumbnail: "/images/g4.jpg",
    },
    {
      original: "/images/g5.jpg",
      thumbnail: "/images/g5.jpg",
    },
    {
      original: "/images/g6.jpg",
      thumbnail: "/images/g6.jpg",
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const whyUsRef = useRef(null);
  const newToGymingRef = useRef(null);
  const galleryRef = useRef(null);
  const plansRef = useRef(null);

  const whyUsInView = useInView(whyUsRef, { once: true });
  const newToGymingInView = useInView(newToGymingRef, { once: true });
  const galleryInView = useInView(galleryRef, { once: true });
  const plansInView = useInView(plansRef, { once: true });

  return (
    <div className="bg-black text-white">
      {/* Main Hero Section */}
      <motion.section id="home">
      <motion.div
        className="h-screen flex items-center justify-center text-left bg-cover bg-center text-white px-8"
        style={{
          backgroundImage: `url('/images/homebg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          className="relative z-20 space-y-6 max-w-2xl ml-[-100px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="text-7xl font-bold uppercase text-yellow-400">SHAPE IT UP!</h2>
          <p className="text-5xl italic text-white">GET FIT DON'T QUIT</p>
          <p className="text-2xl text-gray-300 max-w-2xl">Push harder than yesterday if you want a different tomorrow</p>
          <Link to="/Registration">
            <motion.button
              className="bg-yellow-500 text-lg hover:bg-yellow-600 rounded text-black font-bold py-6 px-8 text-lg transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              JOIN US NOW
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      </motion.section>
       {/* New to Gyming/Working Hours Section */}
      <motion.div
        className="bg-black text-white items-center text-center py-12 px-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={sectionVariants}
        initial="hidden"
        animate={newToGymingInView ? "visible" : "hidden"}
        ref={newToGymingRef}
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-3xl font-semibold text-yellow-400">New to gyming?</h3>
          <p className="text-lg text-gray-300">We got you covered with our Fitness plans</p>
          <p className="text-gray-400"></p>
          <Link to="/Registration">
          <motion.button
            className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            START NOW!
          </motion.button>
          </Link>
        </motion.div>
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-3xl font-semibold text-yellow-400">Working hours</h3>
          <div className="text-gray-300">
            <p>Sunday<br />7:00 AM - 7:00 PM</p>
            <p>Monday - Saturday<br />5:00 AM - 8:00 PM</p>
          </div>
        </motion.div>
      </motion.div>


      {/* Why Us Section */}
      <motion.section
        id="home"
        className="px-8 py-16 bg-black"
        variants={sectionVariants}
        initial="hidden"
        animate={whyUsInView ? "visible" : "hidden"}
        ref={whyUsRef}
      >
        <motion.div
          className="max-w-5xl mx-auto text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6">Why Choose Us?</h2>
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-6">Build something stronger than muscles.</h3>
          <p className="text-gray-400 text-2xl leading-relaxed">
            What makes us special isn’t our weight rack or our treadmills—of course, we have those things, but what sets us apart from other gyms is the people inside our four walls. Our goal is to help you tackle anything that stands in the way of a healthier you, together. We know fitness journeys don’t follow a straight line and our coaches are fluent in helping you get back on track after detours. We are ready to meet you where you’re at, build a customized plan that works for you and keep you feeling motivated, strong and confident.
          </p>
        </motion.div>
      </motion.section>


      {/* Gallery Section */}
      <motion.section
        id="gallery"
        className="px-8 py-16 bg-white"
        variants={sectionVariants}
        initial="hidden"
        animate={galleryInView ? "visible" : "hidden"}
        ref={galleryRef}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">Our Fitness Gallery</h2>
        <ImageGallery items={images} />
      </motion.section>

      {/* Membership Plans Section */}
   {/* Membership Plans Section */}
<motion.section
  id="plans"
  className="px-8 py-16 bg-black"
  variants={sectionVariants}
  initial="hidden"
  animate={plansInView ? "visible" : "hidden"}
  ref={plansRef}
>
  <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-400 mb-10">
    Membership Plans
  </h2>
  
  <div className="flex flex-wrap justify-center gap-6">
    {[
      {
        title: "Standard Plan",
        features: ["Access to gym facilities", "Personalized workout plan"],
        price: "Rs. 12,000/year",
      },
      {
        title: "Premium Plan",
        features: [
          "Access to gym facilities",
          "Personalized workout plan",
          "1-on-1 coaching sessions",
        ],
        price: "Rs. 18,000/year",
      },
      // {
      //   title: "VIP Plan",
      //   features: [
      //     "Access to gym facilities in PRIVATE workspace",
      //     "Personalized workout plan",
      //     "1-on-1 coaching sessions with assigned trainers",
      //   ],
      //   price: "Rs. 24,000/year",
      // },
    ].map((plan, index) => (
      <motion.div
        key={index}
        className="w-full md:w-1/3 p-8 bg-gray-300 shadow-lg rounded-xl text-center transform hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-black mb-4">{plan.title}</h3>
        <ul className="text-black space-y-2 mb-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-yellow-400 font-semibold">✓</span> {feature}
            </li>
          ))}
        </ul>
        <p className="text-xl font-bold text-black mb-4">{plan.price}</p>
        <Link to="/Registration">
          <button className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300">
            Join Now
          </button>
        </Link>
      </motion.div>
    ))}
  </div>
</motion.section>


      {/* Footer */}
      <footer className="text-center bg-black text-white py-6">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <span className="font-bold">Caliber Fitness</span>. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import redHawk from "../assets/redHawk.jpg";
import yellowTape from "../assets/yellowTape.jpg";
import cardAlleyPic from "../assets/cardAlleyPic.jpg";  



const aboutCards = [
  {
    title: "Our Goal",
    content: "We wish to provide you with real time statistics to keep you safe, much like a lampost will light up the streets and deter crime. We wish to do the same!",
    image: cardAlleyPic 
  },
  {
    title: "Our Team",
    content: "Our development team consist of proud Indiana University of Pennsylvania students who have worked hard to bring you the safest streets.",
    image: redHawk  
  },
  {
    title: "Our Tech",
    content: "We provide you the most up to date and accurate crime data possible. Using the UCR website, we can get live updates of crime happening around Pennsylvania",
    image: yellowTape
  },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false); // To detect hover state
  const card = aboutCards[index];

  const next = () => setIndex((prev) => (prev + 1) % aboutCards.length);
  const prev = () => setIndex((prev) => (prev - 1 + aboutCards.length) % aboutCards.length);
  const goToSlide = (index) => setIndex(index);

  // ⏱ Auto-play every 8.5 seconds, but pause on hover
  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        next();
      }, 8500);

      return () => clearInterval(interval); // cleanup
    }
  }, [isHovering]);

  return (
    <div className="w-full flex flex-col items-center mt-24">
      <motion.h2
        className="text-2xl font-semibold text-white text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About Us
      </motion.h2>

      <div
        className="relative w-full flex justify-center items-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 text-white hover:text-gray-300 transition"
        >
          <ChevronLeft size={36} />
        </button>

        {/* Animated Card */}
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-[80%] bg-gray-900 bg-opacity-80 text-white p-8 rounded-lg shadow-lg text-center transition-all duration-300"
        >
          {/* Image */}
          <div className="mb-4">
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p className="text-base leading-relaxed">{card.content}</p>
        </motion.div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-4 md:right-8 text-white hover:text-gray-300 transition"
        >
          <ChevronRight size={36} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex mt-4 gap-2">
        {aboutCards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === idx ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

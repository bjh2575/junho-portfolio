"use clinet";
import { motion } from "framer-motion";

const RotatingShape = ({ content, direction, duration }) => {
  // define the rotation animation
  const rotationAnimation = {
    animate:{
        // rotate 360 degress based on the direction
        rotate: direction ==="right" ? 360 : direction === "left" ? -360 : 0,
        transition: {
            duration: duration, // dration of the full rotation
            ease: "linear", // smooth rotation 
            repeat: Infinity, //repeat infinitely
        },
    },
  };

  return <motion.div variants={rotationAnimation} animate="animate">
        {content}
    </motion.div>;
};

export default RotatingShape;

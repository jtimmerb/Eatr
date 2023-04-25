import React from "react";
import { motion } from "framer-motion";

interface IProps {
  children: React.ReactNode;
  factor?: number;
  standalone?: boolean;
}

const FadeOut: React.FC<IProps> = (props) => {
  const { children, factor = 1, standalone } = props;

  const transition = { duration: 0.25 * factor, type: "spring" };

  const variants = {
    initial: { y: -25, opacity: 0 },
    enter: { y: 0, opacity: 1, transition },
    exit: { y: -25, opacity: 0, transition: { duration: 0.15 * factor } },
  };

  if (standalone)
    return (
      <motion.div
        initial="initial"
        exit="exit"
        animate="enter"
        className="w-full"
        variants={variants}
      >
        {children}
      </motion.div>
    );

  return (
    <motion.div className="w-full" variants={variants}>
      {children}
    </motion.div>
  );
};

export default FadeOut;

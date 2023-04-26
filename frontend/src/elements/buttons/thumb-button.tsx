import { motion } from "framer-motion";
import React from "react";

import ThumbsUp from "../icons/thumbsUp";
import ThumbsDown from "../icons/thumbsDown";

interface IProps {
  onClick?: () => void;
  variant?: "like" | "dislike";
}

const ThumbButton: React.FC<IProps> = (props) => {
  const { onClick, variant } = props;

  // Variants
  let content = (
    <button
      onClick={onClick}
      type="button"
      className="rounded-full p-3.5 bg-red-100 shadow"
    >
      <ThumbsDown className="w-5 h-5 text-red-500" />
    </button>
  );

  if (variant === "like")
    content = (
      <button
        onClick={onClick}
        type="button"
        className="rounded-full p-3.5 bg-green-100 shadow"
      >
        <ThumbsUp className="w-5 h-5 text-green-500" />
      </button>
    );

  return (
    <motion.div
      className="inline-block"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
    >
      {content}
    </motion.div>
  );
};

export default ThumbButton;

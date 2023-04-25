import React, { useState } from "react";
import { motion } from "framer-motion";

import InfoSection from "./infoSection";
import { Recipe } from "../../../api/recipe/recipe";
import IconButton from "../buttons/iconButtons";
import ChevronDown from "../icons/chevronDown";


// Divider (1px tall horizontal line)
interface IDivider {
  transparent?: boolean;
  children: React.ReactNode
  className?: string
}
const Divider: React.FC<IDivider> = (props) => (
  <div
    className={`h-px w-full flex duration-500 ${
      props.transparent ? "bg-transparent" : "bg-gray-200"
    } ${props.className}`}
  >
    {props.children}
  </div>
);

// Animation
const wrapperVariants = {
  // open: { y: "-16rem", transition: { duration: 0.5 } },
  open: { y: 0, transition: { duration: 0.5 } },
  closed: { y: 0, transition: { duration: 0.5 } },
};
const buttonVariants = {
  open: { y: 0, rotate: 0, transition: { duration: 0.75 } },
  closed: { y: 0, rotate: 180 + 360 * 2, transition: { duration: 0.5 } },
  enter: { y: 0, rotate: 180 + 360 * 2 },
};

const swipeConfidenceThreshold = 150000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Main Movie card
interface IProps {
  name?: string;
  recipe: Recipe;
}

const RecipeInfoCard: React.FC<IProps> = ({ recipe }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggle = () => setOpen(!open);

  const animate = open ? "open" : "closed";


  return (
    <motion.div
      className={`absolute inset-0 h-full z-20 ease-in-out duration-300 ${
        open ? "top-0" : "top-full -mt-16"
      }`}
      variants={wrapperVariants}
      animate={animate}
    >
      <motion.div
        drag={false} /* Error with custom handler */
        dragConstraints={{ bottom: 0, top: 0, left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.y, velocity.y);

          if (swipe < -swipeConfidenceThreshold && !open) {
            toggle();
          } else if (swipe > swipeConfidenceThreshold && open) {
            toggle();
          }
        }}
        className={`z-30 rounded-xl w-full p-3 shadow-md h-full pb-16 ${
          open ? "overflow-y-scroll bg-white" : ""
        }`}
      >
        <div className="relative py-2">
          <Divider transparent={!open} className="justify">
            <div className="inline-block right-1 absolute -translate-x-1/2 -translate-y-1/2 z-20">
              <IconButton transparent={!open} onClick={toggle} variant="light">
                <motion.div
                  variants={buttonVariants}
                  animate={animate}
                  initial={buttonVariants.closed}
                >
                  <ChevronDown className="w-5 h-5 text-gray-700" />
                </motion.div>
              </IconButton>
            </div>
          </Divider>
        </div>

        <div className="flex flex-col space-y-3 overflow-hidden px-1">
          <div className="flex flex-col space-y-2 py-2"></div>
          <InfoSection ingredients={recipe.ingredients} steps={recipe.steps}/>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeInfoCard;

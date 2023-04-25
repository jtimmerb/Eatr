import React, { useState } from "react";
import { motion } from "framer-motion";

import InfoSection from "./infoSection";
import Badge from "../data/badge";

// Divider (1px tall horizontal line)
interface IDivider {
  transparent?: boolean;
}
const Divider: React.FC<IDivider> = (props) => (
  <div
    className={`h-px w-full flex  duration-500 ${
      props.transparent ? "bg-transparent" : "bg-gray-200"
    }`}
  >
    {props.children}
  </div>
);

// Animation
const wrapperVariants = {
  open: { y: "-16rem", transition: { duration: 0.5 } },
  closed: { y: 0, transition: { duration: 0.5 } },
};
const buttonVariants = {
  open: { y: 0, rotate: 0, transition: { duration: 0.75 } },
  closed: { y: -8, rotate: 180 + 360 * 2, transition: { duration: 0.5 } },
  enter: { y: -8, rotate: 180 + 360 * 2 },
};

const swipeConfidenceThreshold = 150000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Main Movie card
interface IProps {
  name?: string;
  movie: Movie;
}

const RecipeInfoCard: React.FC<IProps> = ({ movie }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggle = () => setOpen(!open);

  const animate = open ? "open" : "closed";

  const genres = movie.genres.split(", ");

  return (
    <motion.div
      className="absolute inset-0 px-4 top-full -mt-20 z-20"
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
        className={`z-30 bg-white rounded-xl w-full p-3 shadow-md max-h-96 pb-16 ${
          open ? "overflow-y-scroll" : ""
        }`}
      >
        <div className="flex flex-col space-y-0.5 z-30">
          <div className="flex flex-row justify-between">
            <p className="text-lg font-bold line-clamp-1">{movie.title}</p>
            <div className="flex flex-row items-center space-x-0.5">
              <p>{movie.ratings.imdb}</p>
              <Star className="h-3.5 w-3.5 text-yellow-500 -mt-px" />
            </div>
          </div>

          <div className="flex flex-row items-center space-x-1 text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <p>{movie.year}</p>
          </div>
        </div>

        <div className="relative py-2 ">
          <Divider transparent={!open}>
            <div className="inline-block left-1/2 absolute -translate-x-1/2 -translate-y-1/2 z-20 ">
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

        <div className="flex flex-col space-y-3 overflow-hidden mt-2">
          <div className="flex flex-col space-y-2 py-2">
            <p className="gray-700 text-sm">{movie.plot}</p>
            <div className="flex flex-row space-x-2">
              {genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          </div>

          <Divider />

          <InfoSection title="Director" contents={movie.director} />

          <InfoSection title="Actors" contents={movie.stars} />

          <InfoSection title="Full Title" contents={movie.title} />

          <InfoSection title="Runtime" contents={movie.runtime} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecipeInfoCard;

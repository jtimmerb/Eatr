import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useWindowSize, useWindowWidth } from "@react-hook/window-size";

import { RootState, useAppDispatch } from "../../state";
import { Recipe } from "../../api/recipe";
import RecipeInfoCard from "./recipeInfoCard";
import {
  getRecipeDetails,
  removeRecipeDetails,
} from "../../state/recipes/recipes";
import { useSelector } from "react-redux";

// Swiping threshold
const threshold = 0.275;
const colorThreshold = 10;

// Main component
interface IProps {
  onChange?: (liked: boolean) => void;
  liked?: boolean;
  active?: boolean;
  hidden?: boolean;
  recipe: Recipe;
}

const RecipeCard: React.FC<IProps> = (props) => {
  const { onChange = () => ({}), active, liked, recipe, hidden } = props;
  const [key, setKey] = useState(0);
  const x = useMotionValue(0);

  const width = useWindowWidth();

  const greenOpacity = useTransform(x, [width / colorThreshold, width], [0, 1]);
  const redOpacity = useTransform(x, [-width, -width / colorThreshold], [1, 0]);

  // Update variants
  let exitX = "0";
  if (liked !== undefined) exitX = liked ? "100vw" : "-100vw";
  let exitY = 10;
  if (liked !== undefined) exitY = 0;

  const variants = {
    initial: { y: -10, x: 0, scale: 0.95, opacity: 0 },
    enter: {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.35, type: "spring" },
    },
    exit: {
      y: exitY,
      x: exitX,
      opacity: 1,
      transition: { duration: 0.35, type: "spring" },
    },
  };

  const windowSize = useWindowSize();

  useEffect(() => {
    setKey(key + 1);
  }, [windowSize]);

  // console.log(useWindowSize());
  const dispatch = useAppDispatch();

  const { recipeDetails } = useSelector((state: RootState) => state.recipes);

  // Fetch Recipe Ingredients
  useEffect(() => {
    dispatch(
      getRecipeDetails({
        recipeID: recipe.recipeId,
      })
    );
  }, []);

  // Delete details on unmount
  useEffect(
    () => () => {
      dispatch(removeRecipeDetails(recipe.recipeId));
    },
    []
  );

  return (
    <div key={key} className={`absolute inset-0 ${hidden ? "hidden" : ""}`}>
      <motion.div
        className="w-full h-full"
        variants={variants}
        style={{ x }}
        initial="initial"
        animate={hidden ? "initial" : "enter"}
        exit="exit"
        drag={active ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        whileDrag={{ scale: 1.01 }}
        onDragEnd={(e, t) => {
          if (t.point.y === 0) return;
          const relativeOffset = (t.point.x - width / 2) / width;
          if (relativeOffset > threshold) {
            onChange(true);
          } else if (relativeOffset < -threshold) {
            onChange(false);
          }
        }}
      >
        <div className="w-full h-full rounded-3xl overflow-hidden duration-500 ease-in-out relative shadow-lg">
          <div className="inset-0 absolute z-10 bg-indigo-200">
            <motion.div
              className="absolute bottom-0 inset-0 z-10 bg-red-500"
              style={{ opacity: redOpacity }}
            />
            <motion.div
              className="absolute bottom-0 inset-0 z-10 bg-green-500"
              style={{ opacity: greenOpacity }}
            />
            <div className="absolute left-0 right-0 top-0 bottom-0 floral-pattern">
              <img className="object-cover h-full w-full" src={recipe.image} />
            </div>
            <p className="absolute bottom-0 inset-x-6 z-10 h-28 text-gray-100 text-3xl font-bold shadow-lg">
              {recipe.name}
            </p>

            <div className="absolute bottom-0 inset-x-0 z-0 h-52 from-black bg-gradient-to-t" />
          </div>
          <RecipeInfoCard
            recipe={recipe}
            ingredients={
              recipeDetails[recipe.recipeId]
                ? recipeDetails[recipe.recipeId].details.ingredients
                : undefined
            }
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeCard;

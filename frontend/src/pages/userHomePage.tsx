import React, { useEffect, useState } from "react";

import HomeIcon from "../images/homeIcon";
import SaveTab from "../images/saveTab";
import PageSearch from "../images/searchPage";
import { Link } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import HomeCard from "../elements/layout/homeCard";
import RecipeDashboardCard from "../elements/layout/recipeDashboardCard";
import ArrowIcon from "../images/arrowIcon";
import Container from "../elements/layout/container";
import { RootState, useAppDispatch } from "../state";
import { useSelector } from "react-redux";
import { listItems } from "../state/pantry/pantry";
import { listSavedRecipes } from "../state/recipes/recipes";
import Backdrop from "../elements/layout/backdrop";
import RecipeCard from "../elements/cards/recipeCard";

const SectionHeader: React.FC<{ children: React.ReactNode }> = (props) => (
  <p className="text-lg font-bold text-gray-900">{props.children}</p>
);

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-300" />;

const UserHome: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showRecipeDetails, setShowRecipeDetails] = useState<boolean>();

  const dispatch = useAppDispatch();

  const { items: pantryItems } = useSelector(
    (state: RootState) => state.pantry
  );

  const { savedRecipes } = useSelector((state: RootState) => state.recipes);
  const curRecipe =
    savedRecipes.length > index ? savedRecipes[index] : undefined;

  useEffect(() => {
    dispatch(listItems({}));
    dispatch(listSavedRecipes({}));
  }, []);

  return (
    <>
      <PageHeader backAddr="/logout">Home</PageHeader>
      <Container className="mt-4">
        {/* Discover section */}
        <div className="mt-6 mb-5">
          <Link to="/discover">
            <HomeCard title="Discover" background="floral-pattern" />
          </Link>
        </div>

        <Divider />

        {/* Saved recipes section */}
        <div className="mt-6 mb-5">
          <div className="flex flex-row justify-between">
            <SectionHeader>Saved Recipes</SectionHeader>
            <div className="flex flex-row items-center">
              <Link to="/savedrecipes">
                <p className="text-base text-center font-medium text-gray-500 mr-2">
                  View All
                </p>
              </Link>
              <ArrowIcon className="stroke-gray-500 rotate-180 w-5 h-5 mt-[-5px]" />
            </div>
          </div>
          <div className="flex flex-row flex-no-wrap overflow-x-scroll py-2">
            {savedRecipes.map((recipe, i) => (
              <RecipeDashboardCard
                image={recipe.image}
                key={recipe.recipeId}
                hasMargin={
                  i < savedRecipes.length - 1 && savedRecipes.length > 2
                    ? i > 0
                    : true
                }
                title={recipe.name}
                onExpand={() => {
                  setIndex(i);
                  setShowRecipeDetails(true);
                }}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* My Pantry section */}
        <div className="mt-6 mb-5">
          <SectionHeader>My Pantry</SectionHeader>
          <div className="my-2" />
          <Link to="/pantry">
            <HomeCard
              title={`${pantryItems.length} Ingredients`}
              background="food-pattern"
            />
          </Link>
        </div>
      </Container>

      {showRecipeDetails ? (
        <Backdrop onClose={() => setShowRecipeDetails(false)}>
          <Container>
            <div className="flex flex-col space-y-8 w-full h-full">
              <div className="relative h-[70vh] mt-[10vh]">
                {curRecipe ? <RecipeCard recipe={curRecipe} /> : null}
              </div>
            </div>
          </Container>
        </Backdrop>
      ) : null}
    </>
  );
};

export default UserHome;

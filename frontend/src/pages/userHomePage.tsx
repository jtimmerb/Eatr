import React from "react";

import HomeIcon from "../images/homeIcon";
import SaveTab from "../images/saveTab";
import PageSearch from "../images/searchPage";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import HomeCard from "../elements/layout/homeCard";
import RecipeDashboardCard from "../elements/layout/recipeDashboardCard";
import ArrowIcon from "../images/arrowIcon";
import Container from "../elements/layout/container";

const SectionHeader: React.FC<{ children: React.ReactNode }> = (props) => (
  <p className="text-lg font-bold text-gray-900">{props.children}</p>
);

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-300" />;

interface IRecipe {
  name: string;
}

const UserHome: React.FC = () => {
  const navigate = useNavigate();

  const navFindRec = () => {
    console.log("findrec");
    navigate("/discover");
  };
  const navMyRecipes = () => {
    console.log("myRecipes");
    navigate("/myrecipes");
  };
  const navSavedRecipes = () => {
    console.log("savedRecipes");
    navigate("/savedrecipes");
  };

  const recipes: IRecipe[] = [
    {
      name: "Chicken Parmesian",
    },
    {
      name: "Mushroom Risotto",
    },
    {
      name: "Sunday Gravy",
    },
  ];

  return (
    <>
      <PageHeader backAddr="/login">Home</PageHeader>
      <Container className="mt-4">
        {/* Discover section */}
        <div className="mt-6 mb-5">
          <HomeCard title="Discover" background="floral-pattern" />
        </div>

        <Divider />

        {/* Saved recipes section */}
        <div className="mt-6 mb-5">
          <div className="flex flex-row justify-between">
            <SectionHeader>Saved Recipes</SectionHeader>
            <div className="flex flex-row items-center">
              <p className="text-base text-center font-medium text-gray-500 mr-2">
                View All
              </p>
              <ArrowIcon className="stroke-gray-500 rotate-180 w-5 h-5 mt-[-5px]" />
            </div>
          </div>
          <div className="flex flex-row flex-no-wrap overflow-x-scroll py-2">
            {recipes.map((recipe, i) => (
              <RecipeDashboardCard
                key={recipe.name}
                hasMargin={i < recipes.length - 1 && i > 0}
                title={recipe.name}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* My Pantry section */}
        <div className="mt-6 mb-5">
          <SectionHeader>My Pantry</SectionHeader>
          <div className="my-2" />
          <HomeCard title="6 Ingredients" background="food-pattern" />
        </div>
      </Container>
    </>
  );
};

export default UserHome;

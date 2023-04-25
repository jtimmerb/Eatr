import React, { useEffect } from "react";

import HomeIcon from "../images/homeIcon";
import SaveTab from "../images/saveTab";
import PageSearch from "../images/searchPage";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";
import HomeCard from "../elements/layout/homeCard";
import RecipeDashboardCard from "../elements/layout/recipeDashboardCard";
import ArrowIcon from "../images/arrowIcon";
import Container from "../elements/layout/container";
import { RootState, useAppDispatch } from "../state";
import { useSelector } from "react-redux";
import { listItems } from "../state/pantry/pantry";

const SectionHeader: React.FC<{ children: React.ReactNode }> = (props) => (
  <p className="text-lg font-bold text-gray-900">{props.children}</p>
);

const Divider: React.FC = () => <div className="h-[1px] w-full bg-gray-300" />;

interface IRecipe {
  name: string;
}

const UserHome: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { items: pantryItems } = useSelector(
    (state: RootState) => state.pantry
  );

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

  useEffect(() => {
    dispatch(listItems({}));
  }, []);

  return (
    <>
      <PageHeader backAddr="/login">Home</PageHeader>
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
          <Link to="/pantry">
            <HomeCard
              title={`${pantryItems.length} Ingredients`}
              background="food-pattern"
            />
          </Link>
        </div>
      </Container>
    </>
  );
};

export default UserHome;

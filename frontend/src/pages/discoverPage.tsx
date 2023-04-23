import { useSelector, useDispatch } from "react-redux";
import PageHeader from "../elements/pageHeader";
import RecipeCard from "../elements/recipeCard";

const DiscoverPage = (): JSX.Element => {
  const db = [
    {
      name: "Chicken Vindaloo",
      recipeId: 1,
      steps: ["Step1", "step2"],
      // url: "./img/richard.jpg",
    },
    {
      name: "Hamburger",
      recipeId: 1,
      steps: ["Step1", "step2"],
      // url: "./img/erlich.jpg",
    },
    {
      name: "Hot Pot",
      recipeId: 1,
      steps: ["Step1", "step2"],
      // url: "./img/monica.jpg",
    },
    {
      name: "Biryani",
      recipeId: 1,
      steps: ["Step1", "step2"],
      // url: "./img/jared.jpg",
    },
    {
      name: "Pad Thai",
      recipeId: 1,
      steps: ["Step1", "step2"],
      // url: "./img/dinesh.jpg",
    },
  ];

  return (
    <>
      <PageHeader pageName="Discovery" backAddr="/userhome" />
      <div className="h-10"></div>
      <RecipeCard recipes={db} />
    </>
  );
};

export default DiscoverPage;

import "../index.css";
import SearchGlass from "../images/searchGlass";
import HomeIcon from "../images/homeIcon";
import RecipeStack from "../images/recipeIcon";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";

const UserHome = (): JSX.Element => {
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

  return (
    <>
      <PageHeader pageName="Home" backAddr="/login" />
      <div className="pt-32 flex flex-col justify-center items-center w-full">
        <label>LIKED RECIPES</label>
        <button
          name="likedRecipes"
          className="mt-6 w-52 h-10 bg-red-400 rounded-md flex justify-center items-center"
          type="button"
          onClick={navSavedRecipes}
        >
          <RecipeStack />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center w-full pt-32">
        <label>MY RECIPES</label>
        <button
          name="myRecipes"
          className="mt-6 w-52 h-10 bg-red-400 rounded-md flex justify-center items-center"
          type="button"
          onClick={navMyRecipes}
        >
          <HomeIcon />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center w-full">
        <div className="pt-32 flex flex-row  justify-center">
          <label>FIND FOOD</label>
        </div>
        <button
          name="myRecipes"
          className="mt-6 w-52 h-10 bg-red-400 rounded-md flex justify-center items-center"
          type="button"
          onClick={navFindRec}
        >
          <SearchGlass />
        </button>
      </div>
    </>
  );
};

export default UserHome;

import { useSelector } from "react-redux";
import { selectName, selectId } from "../states/userSlice";
import { useNavigate } from "react-router-dom";
import PageHeader from "../elements/pageHeader";

const UserRecipePage = (): JSX.Element => {
  const navigate = useNavigate();

  const navFindRec = () => {
    console.log("findrec");
  };

  return (
    <>
      <PageHeader pageName="My Recipes" backAddr="/userhome" />
    </>
  );
};

export default UserRecipePage;

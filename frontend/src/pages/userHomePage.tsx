import "../index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectName, selectId } from "../states/userSlice";

const userHome = (): JSX.Element => {
  const navigate = useNavigate();
  const userName = useSelector(selectName);

  return <div>{userName}</div>;
};

export default userHome;

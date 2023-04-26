import React, { useEffect } from "react";
import { useAppDispatch } from "../state";
import { logout } from "../state/user/user";
import { reset as resetPantry } from "../state/pantry/pantry";
import { reset as resetErrors } from "../state/errors/errors";
import { reset as resetRecipes } from "../state/recipes/recipes";
import { useNavigate } from "react-router-dom";

const LogoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    dispatch(resetPantry());
    dispatch(resetErrors());
    dispatch(resetRecipes());
    navigate("/");
  }, []);

  return <></>;
};

export default LogoutPage;

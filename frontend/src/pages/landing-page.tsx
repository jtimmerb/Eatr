import React from "react";
import { useNavigate } from "react-router-dom";

import RedSolidButton from "../elements/buttons/red-solid-button";
import WhiteSolidButton from "../elements/buttons/white-solid-button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const changeToLogin = () => {
    navigate("login");
  };

  const changeToSignUp = () => {
    navigate("signup");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-40">
        <h1 className="text-center text-5xl font-extrabold text-gray-900">
          Eatr
        </h1>
        <div className="flex flex-col items-center justify-center space-y-3">
          <RedSolidButton onClick={changeToLogin}>Login</RedSolidButton>
          <WhiteSolidButton onClick={changeToSignUp}>Sign Up</WhiteSolidButton>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateName, updateRecipes } from "../states/userSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../elements/modal";
import PageHeader from "../elements/pageHeader";


import RedSolidButton from "../elements/buttons/red-solid-button";

interface IProps {

}

const LoginPage: React.FC<IProps> = () => {
  const [username, setUsername] = useState('');

  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  const changeToSignUp = () => {
    navigate('../signup');
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Login</h1>
        <div className="mt-6">
          <form onSubmit={handleSubmit} className="">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                className="border rounded-md py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-1"
                required
              />
            </div>
            <RedSolidButton onClick={handleSubmit}>Login</RedSolidButton>
            <div className="flex justify-center mt-4">
              <p className="text-gray-600">Don't have an account?</p>
              <a className="text-red-400 ml-2 font-bold hover:underline" onClick={changeToSignUp}>
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 

export default LoginPage;

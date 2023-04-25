import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../elements/pageHeader";
import Container from "../elements/layout/container";
import RedSolidButton from "../elements/buttons/red-solid-button";
import { login } from "../state/user/user";
import { useAppDispatch } from "../state";

interface IProps {}

const LoginPage: React.FC<IProps> = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const dispatch = useAppDispatch();

  const changeToSignUp = () => {
    navigate("../signup");
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    dispatch(
      login({
        name: username,
      })
    )
      .unwrap()
      .then(() => navigate("/home"));
  };

  return (
    <Container>
      <PageHeader backAddr="..">Login</PageHeader>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col content-center items-center pt-52"
      >
        <div className="mb-4 w-3/4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            className="border rounded-md py-2 px-3 w-full text-gray-700 text-sm"
            required
          />
        </div>

        <div className="pt-40">
          <RedSolidButton onClick={handleSubmit} disabled={username === ""}>
            Login
          </RedSolidButton>
          <div className="flex justify-center mt-4">
            <p className="text-gray-600 text-sm">Don't have an account?</p>
            <a
              className="text-red-400 ml-2 font-bold text-sm"
              onClick={changeToSignUp}
            >
              Sign up
            </a>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default LoginPage;

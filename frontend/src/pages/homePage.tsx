import React from "react";

import "../index.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("login");
    navigate("/login");
  };

  const handleSignUp = () => {
    console.log("signup");
    navigate("/signup");
  };

  return (
    <div className="App flex flex-col h-screen justify-center items-center text-center">
      <div className="w-32 h-24 not-italic font-extrabold text-6xl tracking-tighter text-black pb-24">
        Eatr
      </div>
      <header className="App-header flex flex-col justify-center items-center pt-52">
        <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />
      </header>
    </div>
  );
};

interface LoginFormProps {
  onLogin: () => void;
  onSignUp: () => void;
}

function LoginForm(props: LoginFormProps): JSX.Element {
  const handleLogin = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.onLogin();
  };

  const handleSignUp = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.onSignUp();
  };

  return (
    <form className="flex flex-col items-center">
      <div className="py-2">
        <button
          className="box-border relative w-56 h-10 bg-red-400 text-white text-center rounded-full shadow"
          type="submit"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <div>
        <button
          className="bg-transparent border-2 text-center relative w-56 h-10 border-red-400 text-red-400 rounded-full shadow"
          type="submit"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}

export default Home;

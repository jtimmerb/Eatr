import React, { useState } from "react";
import "../index.css";

function App(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App flex flex-col h-screen justify-center items-center text-center">
      <div className="w-32 h-24 not-italic font-extrabold text-6xl tracking-tighter text-black pb-24">
        Eatr
      </div>
      <header className="App-header flex flex-col justify-center items-center pt-52">
        <LoginForm onLogin={handleLogin} onSignUp={handleLogout} />
      </header>
    </div>
  );
}

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
          className="box-border relative w-56 h-10 bg-red-400 hover:bg-red-500 text-white text-center rounded-full"
          type="button"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <div>
        <button
          className="bg-transparent border-2 text-center relative w-56 h-10 border-red-400 text-red-400 rounded-full"
          type="button"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}

export default App;

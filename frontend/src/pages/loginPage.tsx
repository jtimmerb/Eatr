import React, { useId, useState } from "react";
import "../index.css";

const Login = (): JSX.Element => {
  const loginSucc = () => {
    console.log("login");
  };

  return (
    <div className="App flex flex-col h-screen justify-top items-center text-center">
      <div className="w-32 h-24 not-italic font-extrabold text-3xl tracking-tighter text-black pt-14 pb-56">
        Login
      </div>
      <header className="App-header flex flex-col justify-center items-center pt-24">
        <LoginForm loginSucc={loginSucc} />
      </header>
    </div>
  );
};

interface LoginFormProps {
  loginSucc: () => void;
}

function LoginForm(props: LoginFormProps): JSX.Element {
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.loginSucc();
    console.log(username);
  };

  const [username, setUsername] = useState("");

  return (
    <form className="" onSubmit={handleLogin}>
      <div className="pb-28">
        <div className="flex text-gray-400">Username</div>
        <div>
          <input
            name="username"
            className="border border-gray-400 rounded-md relative w-full h-10"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="py-2">
        <button
          className="box-border relative w-56 h-10 bg-red-400 text-white text-center rounded-full shadow"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;

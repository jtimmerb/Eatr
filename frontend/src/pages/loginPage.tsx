import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateName, updateRecipes } from "../states/userSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../elements/modal";
import PageHeader from "../elements/pageHeader";

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const loginSucc = () => {
    console.log("login");
  };

  return (
    <div className="">
      <PageHeader pageName="Login" backAddr="/" />
      <header className="App-header flex flex-col items-center pt-52">
        <LoginForm loginSucc={loginSucc} />
      </header>
    </div>
  );
};

interface LoginFormProps {
  loginSucc: () => void;
}

function LoginForm(props: LoginFormProps): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username != "") {
      props.loginSucc();
      console.log(username);
      dispatch(updateName(username));
      //todo update id and liked recipes
      navigate("/userHome");
    } else {
      setShowModal(true);
      // alert("Invalid Login");
    }
  };

  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <form className="" onSubmit={handleLogin}>
      <div className="pb-44">
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
        <Modal
          buttonTitle="Login"
          buttonStyle="box-border relative w-56 h-10 bg-red-400 text-white text-center rounded-full shadow"
          bodyText="Uh-Oh! This username does not exist in our database. Please try again or create a new account."
          showModal={showModal}
          setShowModal={setShowModal}
          event={handleLogin}
        />
      </div>
    </form>
  );
}

export default Login;

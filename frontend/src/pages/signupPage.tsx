import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../elements/modal";

const SignUp = (): JSX.Element => {
  const navigate = useNavigate();

  const signUpSucc = () => {
    console.log("signUp");
  };

  const back = () => {
    navigate("/");
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mx-auto pt-10 pb-52">
        <button name="backArrow" className="ml-4" type="button" onClick={back}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path
              d="M8.41667 15.7917L1.125 8.5M1.125 8.5L8.41667 1.20833M1.125 8.5H19.875"
              stroke="#FD7171"
            />
          </svg>
        </button>
        <label className="not-italic font-extrabold text-3xl tracking-tighter text-black">
          Sign Up
        </label>
        <div className="w-6"></div>
      </div>
      <header className="App-header flex flex-col items-center pt-24">
        <SignUpForm signUpSucc={signUpSucc} />
      </header>
    </div>
  );
};

interface SignUpFormProps {
  signUpSucc: () => void;
}

function SignUpForm(props: SignUpFormProps): JSX.Element {
  const navigate = useNavigate();

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username != "") {
      props.signUpSucc();
      console.log(username);
      navigate("/userHome");
    } else {
      setShowModal(true);
      // alert("Invalid Login");
    }
  };

  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <form className="" onSubmit={handleSignUp}>
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
        <Modal
          buttonTitle="SignUp"
          buttonStyle="box-border relative w-56 h-10 bg-red-400 text-white text-center rounded-full shadow"
          bodyText="Uh-Oh! This username already exists in our database please try again."
          showModal={showModal}
          setShowModal={setShowModal}
          event={handleSignUp}
        />
      </div>
    </form>
  );
}

export default SignUp;

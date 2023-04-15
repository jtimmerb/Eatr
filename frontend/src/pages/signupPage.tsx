import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../elements/modal";
import PageHeader from "../elements/pageHeader";

const SignUp = (): JSX.Element => {
  const signUpSucc = () => {
    console.log("signUp");
  };

  return (
    <>
      <PageHeader pageName="Sign Up" backAddr="/" />
      <div className="App-header flex flex-col items-center pt-52">
        <SignUpForm signUpSucc={signUpSucc} />
      </div>
    </>
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

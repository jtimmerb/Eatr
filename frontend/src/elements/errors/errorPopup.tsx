import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../state";
import { Error as IError, del } from "../../state/errors/errors";

interface IProps {
  error: IError;
}

const variants = {
  initial: { y: -20, opacity: 0 },
  enter: { y: 0, opacity: 1, transition: { duration: 0.35 } },
  exit: { y: -25, opacity: 0, transition: { duration: 0.25 } },
};

// Amount of time the popup will stay visible
const lifespanMS = 5000;

const ErrorPopup: React.FC<IProps> = ({ error }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // On error load
  useEffect(() => {
    // Redirect if necessary
    if (error.redirect) {
      dispatch(del(error.id));
      navigate(error.redirect);
    }

    // Otherwise set a timer to delete error
    setTimeout(() => {
      dispatch(del(error.id));
    }, lifespanMS);
  }, [error]);

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
      role="alert"
    >
      {error.message}
    </motion.div>
  );
};

export default ErrorPopup;

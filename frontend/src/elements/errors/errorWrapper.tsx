import React from "react";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

import { RootState } from "../../state";
import ErrorPopup from "./errorPopup";

const ErrorWrapper: React.FC = () => {
  const { list } = useSelector((state: RootState) => state.errors);

  return (
    <div className="fixed top-2 px-4 z-50 flex flex-col items-center w-full">
      <AnimatePresence>
        {list?.map((err) => (
          <ErrorPopup error={err} key={err.id} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ErrorWrapper;

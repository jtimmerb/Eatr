import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowIcon from "../images/arrowIcon";

interface IProps {
  children: React.ReactNode;
  backAddr: string;
  secondaryIcon?: React.ReactNode;
}

const PageHeader: React.FC<IProps> = ({
  children,
  secondaryIcon,
  backAddr,
}) => {
  const navigate = useNavigate();
  const back = () => {
    navigate(backAddr);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between mx-auto pt-10 ">
        <button name="backArrow" className="ml-12" type="button" onClick={back}>
          <ArrowIcon className="stroke-red-400" />
        </button>
        <label className="not-italic font-extrabold text-3xl tracking-tighter text-black">
          {children}
        </label>
        <div className="flex flex-row w-16 inline-block">{secondaryIcon}</div>
      </div>
    </>
  );
};

export default PageHeader;

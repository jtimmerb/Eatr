import React from "react";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<IProps> = (props) => (
  <div className={"flex flex-col items-center w-full " + props.className}>
    <div className="w-full max-w-xl px-4">{props.children}</div>
  </div>
);

export default Container;

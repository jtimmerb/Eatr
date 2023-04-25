import React from "react";

interface IProps {
  recipeName: string;
  ingredients?: string[];
  steps?: string[];
  contents: string;
}

const InfoSection: React.FC<IProps> = (props) => {
  const { recipeName, contents } = props;

  return (
    <div className="flex flex-col space-y-px">
      <h3 className="font-bold text-base">{recipeName}</h3>
      <p className="text-sm text-gray-700">{contents}</p>
    </div>
  );
};

export default InfoSection;

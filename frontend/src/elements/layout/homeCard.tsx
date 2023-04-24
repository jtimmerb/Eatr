import React from "react";

import Card from "./card";

import "../../images/patterns/patterns.css";
import ArrowIcon from "../../images/arrowIcon";

interface IProps {
  title: string;
  background: "floral-pattern" | "food-pattern";
}

const HomeCard: React.FC<IProps> = (props) => {
  const { title, background } = props;

  return (
    <Card padded className="w-full relative py-6">
      <div
        className={`absolute left-0 right-0 top-0 bottom-0 z-10 ${background}`}
      />
      <div className="absolute left-0 right-0 top-0 bottom-0 z-20 bg-gradient-to-b from-transparent to-[#22222288]" />
      <div className="relative flex flex-row z-30 justify-between">
        <p className="text-xl font-bold text-gray-50 whitespace-nowrap truncate">
          {title}
        </p>
        <div>
          <ArrowIcon className="stroke-white rotate-180" />
        </div>
      </div>
    </Card>
  );
};

export default HomeCard;

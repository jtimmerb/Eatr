import React from "react";

import Card from "./card";

import ArrowIcon from "../../images/arrowIcon";
import ExpandIcon from "../../images/expandIcon";

interface IProps {
  title: string;
  image?: string;
  hasMargin?: boolean;
  onExpand?: () => void;
}

const RecipeDashboardCard: React.FC<IProps> = (props) => {
  const { title, hasMargin, image, onExpand } = props;

  return (
    <div
      className={
        "w-full h-32 max-w-[240px] relative py-6 grow-0 shrink-0 overflow-visible " +
        (hasMargin ? "mx-4" : "")
      }
    >
      <Card
        padded
        className="absolute left-0 right-0 top-0 bottom-0"
        onClick={onExpand}
      >
        <div className="absolute left-0 right-0 top-0 bottom-0 z-10 floral-pattern">
          {image ? (
            <img src={image} className="object-cover h-full w-full" />
          ) : null}
        </div>
        <div className="absolute left-0 right-0 top-0 bottom-0 z-20 bg-gradient-to-b from-transparent to-[#22222288]" />
        <div className="relative w-full h-full z-30">
          <p className="absolute bottom-0 text-xl left-0 right-0 font-bold text-gray-50 whitespace-nowrap truncate">
            {title}
          </p>
        </div>
      </Card>
      <div
        className="absolute top-[-6px] right-[-6px] z-30 rounded-full bg-slate-600 p-1.5 shadow-base overflow-visible"
        onClick={onExpand}
      >
        <ExpandIcon className="stroke-white w-4 h-4" />
      </div>
    </div>
  );
};

export default RecipeDashboardCard;

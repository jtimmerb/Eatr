import React from "react";

import Card from "./card";

import ExpandIcon from "../../images/expandIcon";
import TrashIcon from "../../images/trashIcon";

interface IProps {
  onDelete?: () => void;
  onExpand?: () => void;
  title: string;
  hasMargin?: boolean;
  image?: string;
}

const SavedRecipeCard: React.FC<IProps> = (props) => {
  const { title, hasMargin, image, onDelete, onExpand } = props;

  return (
    <div
      className={
        "w-full h-32 max-w-[340px] relative py-4 ml-2 grow-0 shrink-0 overflow-visible " +
        (hasMargin ? "mt-4" : "")
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
        <div className="absolute left-0 right-0 top-0 bottom-0 z-20 bg-gradient-to-b from-transparent to-[#222222aa]"></div>
        <div className="relative w-full h-full z-30">
          <p className="absolute bottom-0 text-xl left-0 right-0 font-bold text-gray-50 whitespace-nowrap truncate">
            {title}
          </p>
        </div>
      </Card>
      <div className="absolute flex justify-center top-[-6px] right-[-6px] z-30 rounded-full bg-slate-600 p-1.5 shadow-base overflow-visible">
        <button type="button" onClick={onExpand}>
          <ExpandIcon className="stroke-white w-4 h-4" />
        </button>
      </div>
      <div className="absolute flex justify-center top-[-6px] left-[-6px] z-30 rounded-full bg-red-500 p-1.5 shadow-base overflow-visible">
        <button type="button" onClick={onDelete}>
          <TrashIcon className="stroke-white w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SavedRecipeCard;

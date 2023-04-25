import React from "react";
import Checkbox from "../input/checkbox";

interface IProps {
  name: string;
  content: string;
  checked: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ListStep: React.FC<IProps> = (props) => {
  const { name, content, checked, onChange } = props;

  const itemID = "pantry-item-" + name;

  return (
    <div className="flex flex-row justify-between py-4">
      <div className="flex flex-row">
        <Checkbox
          inputID={itemID}
          checked={checked}
          onChange={onChange}
          name={name}
        />
        <label
          className={
            "text-lg font-medium mx-3 " +
            (checked ? "text-gray-400" : "text-gray-900")
          }
          htmlFor={itemID}
        >
          {name}
        </label>
      </div>

      <p
        className={
          "text-lg font-medium " + (checked ? "text-gray-400" : "text-gray-500")
        }
      >
        {content}
      </p>
    </div>
  );
};

export default ListStep;

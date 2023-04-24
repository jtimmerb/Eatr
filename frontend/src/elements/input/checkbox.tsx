import React from "react";

interface IProps {
  name?: string;
  inputID: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Checkbox: React.FC<IProps> = (props) => {
  const { name, inputID, checked, onChange } = props;

  return (
    <label
      className="relative flex cursor-pointer items-center rounded-full appearance-none outline-none focus:outline-none"
      htmlFor={inputID}
    >
      <input
        type="checkbox"
        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-500 transition-all checked:border-gray-400 checked:bg-white outline-none focus:outline-none"
        id={inputID}
        checked={checked}
        value={checked ? "on" : "off"}
        name={name}
        onChange={onChange}
      />
      <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-gray-400 opacity-0 transition-opacity peer-checked:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    </label>
  );
};

export default Checkbox;

import React from "react";

interface Option {
  label: string;
  value: string;
}

interface IProps {
  inputID?: string;
  name?: string;
  value?: string;
  label?: string;
  options: Option[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const SelectInput: React.FC<IProps> = (props) => {
  const { inputID, name, value, options, label, onChange } = props;

  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={inputID}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <select
        id="countries"
        value={value}
        onChange={onChange}
        className="border bg-white rounded-md py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-1"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;

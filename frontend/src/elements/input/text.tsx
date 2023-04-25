import React from "react";

interface IProps {
  inputID?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const TextInput: React.FC<IProps> = (props) => {
  const { inputID, name, value, placeholder, label, onChange } = props;

  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={inputID}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        type="text"
        id={inputID}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-md py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-1"
        required
      />
    </div>
  );
};

export default TextInput;

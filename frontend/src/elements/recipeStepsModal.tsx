import React, { Children } from "react";

interface IProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<IProps> = ({ onClose, children }) => {
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
          <button
            className="absolute top-0 right-0 mt-2 mr-2"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
          <button
            className="bg-red-400 text-white font-bold py-2 px-4 mt-3 rounded shadow-sm"
            type="submit"
            onSubmit={onClose}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

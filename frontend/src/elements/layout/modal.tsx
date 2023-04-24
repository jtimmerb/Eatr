import React, { Children } from "react";

interface IProps {
  title: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<IProps> = ({ onClose, children, title }) => {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 bottom-0 bg-[#00000033] z-50 inset-0 overflow-y-auto">
        <div
          className="absolute left-0 right-0 top-0 bottom-0"
          onClick={() => (onClose ? onClose() : null)}
        ></div>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
            <div className="w-full flex flex-row justify-between">
              <p className="text-2xl font-bold text-gray-800">{title}</p>
              <button className="" onClick={onClose}>
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
            </div>
            <div className="my-3 h-[1px] w-full bg-gray-200" />

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

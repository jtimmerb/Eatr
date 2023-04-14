import { useNavigate } from "react-router-dom";

export default function PageHeader({
  pageName,
  backAddr,
}: {
  pageName: string;
  backAddr: string;
}): JSX.Element {
  const navigate = useNavigate();
  const back = () => {
    navigate(backAddr);
  };
  return (
    <>
      <div className="flex items-center justify-between mx-auto pt-10 ">
        <button name="backArrow" className="ml-12" type="button" onClick={back}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path
              d="M8.41667 15.7917L1.125 8.5M1.125 8.5L8.41667 1.20833M1.125 8.5H19.875"
              stroke="#FD7171"
            />
          </svg>
        </button>
        <label className="not-italic font-extrabold text-3xl tracking-tighter text-black">
          {pageName}
        </label>
        <div className="w-16"></div>
      </div>
    </>
  );
}

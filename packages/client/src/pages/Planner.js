import { IoAddCircle } from "react-icons/io5";
import { useParams } from "react-router-dom";

const Planner = () => {
  let { year } = useParams();
  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            {year} Planners
          </h1>
          <h2 className="text-gray-500">Select a planner</h2>
        </div>
        <div className="flex flex-col justify-center">
          <button className="text-primary text-4xl">
            <IoAddCircle></IoAddCircle>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Planner;

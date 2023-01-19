import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import { useParams } from "react-router-dom";
import PlannerTile from "../components/PlannerTile";
import Api from "../utils/Api";
import {
  PLANNER_ALL_CREATE,
  PLANNER_ONE_UPDATE_DELETE,
} from "../utils/Endpoints";

const Planner = () => {
  let { year } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createErrors, setCreateErrors] = useState("");

  const getAllPlanners = async () => {
    const result = await Api.get(PLANNER_ALL_CREATE.replace(":year", year));
    return result.data;
  };

  const createPlanner = async (name) => {
    return await Api.post(PLANNER_ALL_CREATE.replace(":year", year), {
      name,
      start_date: new Date().toISOString(),
      activities: [
        {
          name: "Date of Commencement of Classes",
          type: "RELATIVE",
          value: 0,
        },
        {
          name: "CA Test 1 - Date of Commencement",
          type: "RELATIVE",
          value: 56,
        },
        {
          name: "CA Test 1 - Last Date of Mark Entry",
          type: "RELATIVE",
          value: 3,
        },
        {
          name: "CA Test 2 - Date of Commencement",
          type: "RELATIVE",
          value: 56,
        },
      ],
    });
  };

  const [planners, setPlanners] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getAllPlanners();
      console.log(data);
      setPlanners(data);
    })();
  }, [showModal]);

  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            <span className="text-secondary">{year}</span> Planners
          </h1>
          <h2 className="text-gray-500">Select a planner</h2>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col justify-center">
            <button className="group text-2xl transition-all">
              <p className="text-primary group-hover:text-secondary">
                Holidays
              </p>
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <button
              onClick={(e) => {
                setShowModal(true);
              }}
              className="group text-4xl hover:scale-[101%] transition-all"
            >
              <IoAddCircle className="text-primary group-hover:text-secondary"></IoAddCircle>
            </button>
          </div>
        </div>
      </div>
      <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {planners.map((planner) => (
          <PlannerTile {...planner} />
        ))}
      </div>
      {showModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          className="absolute left-0 top-0 w-full h-full z-10 bg-secondary/20 grid place-items-center"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-white rounded-lg shadow-lg flex flex-col justify-center p-10"
          >
            <h1 className="text-primary text-3xl mb-4">Name</h1>
            <input
              onChange={(e) => {
                setCreateName(e.target.value);
              }}
              type="text"
              value={createName}
              className="text-2xl underline text-secondary border border-primary rounded-md px-2 py-2 mb-2"
            />
            <p className="text-red-600 mb-4">{createErrors}</p>
            <div className="flex flex-row justify-center">
              <button
                onClick={async (e) => {
                  try {
                    setCreateErrors("");
                    await createPlanner(createName);
                    setShowModal(false);
                  } catch (e) {
                    setCreateErrors("please check name");
                    setTimeout(() => {
                      setCreateErrors("");
                    }, 1500);
                  }
                }}
                className="bg-primary px-4 py-2 rounded-md text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;

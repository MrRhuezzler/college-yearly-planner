import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import ActivityTile from "../components/ActivityTile";
import DatePicker from "react-date-picker";
import ActivitiesProducer from "../context/ActivityContext";
import Api from "../utils/Api";
import { PLANNER_ONE_UPDATE_DELETE } from "../utils/Endpoints";

const Activities = () => {
  let { year, id } = useParams();

  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);

  const fetchPlanner = async () => {
    const result = await Api.get(
      PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id)
    );
    const data = result.data;
    setName(data.name);
    setActivities(data.activities);
    setStartDate(new Date(data.start_date));
  };

  const checkValid = () => {
    if (!name || !activities || activities.length < 0 || !startDate)
      return false;
    return true;
  };

  const updatePlanner = async () => {
    if (checkValid()) {
      const result = await Api.patch(
        PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id),
        {
          name,
          activities,
          start_date: startDate.toISOString(),
        }
      );
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, []);

  useEffect(() => {
    if (!editMode) {
      updatePlanner();
    }
  }, [editMode]);

  useEffect(() => {
    updatePlanner();
  }, [activities]);

  return (
    <div className="p-6">
      <div className="mb-4 w-full flex flex-row justify-between px-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-3">
            <span className="text-secondary">{year}</span> Calendar
          </h1>
          {editMode ? (
            <div className="flex flex-row space-x-4 mb-2">
              <input
                type="text"
                style={{ width: `${name.length}ch` }}
                className={`text-3xl font-semibold bg-gray-100 text-primary underline focus:outline-none max-w-lg`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <button
                onClick={(e) => {
                  setEditMode(!editMode);
                }}
              >
                <AiFillCheckCircle className="text-2xl text-secondary"></AiFillCheckCircle>
              </button>
            </div>
          ) : (
            <h1
              onClick={(e) => {
                setEditMode(!editMode);
              }}
              className="text-3xl font-semibold text-primary hover:cursor-pointer"
            >
              {name}
            </h1>
          )}
        </div>
        <div className="text-center">
          <h1 className="font-pragati text-4xl text-gray-500 mb-2">
            Start date
          </h1>
          {editMode ? (
            <div className="flex flex-row space-x-4 mb-2">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                className="text-primary text-xl bg-gray-100"
              />
              {/* <input
                type="date"
                style={{ width: `${startDate.length}ch` }}
                className={`text-2xl bg-gray-100 text-primary underline focus:outline-none max-w-sm`}
                value={startDate}
                onChange={(e) => {
                  console.log(e.target.value);
                  setStartDate(new Date(e.target.value));
                }}
              /> */}
              <button
                onClick={(e) => {
                  setEditMode(!editMode);
                }}
              >
                <AiFillCheckCircle className="text-xl text-secondary"></AiFillCheckCircle>
              </button>
            </div>
          ) : (
            <h2
              onClick={(e) => {
                setEditMode(!editMode);
              }}
              className="text-2xl text-primary hover:cursor-pointer"
            >
              {startDate.toDateString()}
            </h2>
          )}
        </div>
      </div>
      <p className="mb-8 px-4 text-gray-400 font-pragati">
        <span className="text-red-600">*</span>Click to edit each element
      </p>
      <div className="px-10 lg:px-20 space-y-4">
        <div className="w-full flex flex-row py-5 px-4 transition-all border-b-4 border-b-secondary border-t-4 border-t-secondary">
          <p className="flex-1 text-center">Name</p>
          <p className="flex-1 text-center">Type</p>
          <p className="flex-1 text-center">Value</p>
          <p className="flex-1 text-center">Calculated Date</p>
        </div>
        <ActivitiesProducer
          value={activities}
          setValue={setActivities}
          start_date={startDate}
        >
          {activities.map((activity, index) => (
            <ActivityTile key={index} index={index} {...activity} />
          ))}
        </ActivitiesProducer>
      </div>
    </div>
  );
};

export default Activities;

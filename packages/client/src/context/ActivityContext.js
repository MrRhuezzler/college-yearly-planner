import { createContext, useContext, useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";

const ActivityContext = createContext();

export const activitiesReducer = (state, action) => {
  if (action.type === "CREATE") {
    return [...state, action.data];
  } else if (action.type === "UPDATE") {
    return state.map((value, index) => {
      if (index === action.index) {
        return { ...action.data };
      } else {
        return value;
      }
    });
  } else if (action.type === "DELETE") {
    return state.filter((value) => value.index !== action.index);
  }
};

export const useActivity = () => useContext(ActivityContext);

const ActivitiesProvider = ({ value, setValue, start_date, children }) => {
  const handleActivityAction = (action) => {
    setValue(activitiesReducer(value, action));
  };

  const [calculatedDates, setCalculatedDates] = useState([]);

  const reCalculateDates = () => {
    const newDates = [];
    let date = new Date(start_date);
    for (let activity of value) {
      if (activity.type === "RELATIVE") {
        date.setDate(date.getDate() + activity.value);
        newDates.push(new Date(date));
        // date = calculated;
      } else if (activity.type === "ABSOLUTE") {
        date = new Date(activity.value);
        newDates.push(new Date(date));
      }
    }
    setCalculatedDates(newDates);
  };

  useEffect(() => {
    reCalculateDates();
  }, [value, start_date]);

  return (
    <>
      <ActivityContext.Provider
        value={{ handleActivityAction, calculatedDates }}
      >
        {children}
        <div className="w-full flex flex-row justify-center">
          <button
            onClick={(e) => {
              handleActivityAction({
                type: "CREATE",
                data: {
                  name: "New Activity",
                  type: "RELATIVE",
                  value: 0,
                },
              });
            }}
          >
            <IoAddCircle className="text-primary hover:text-secondary text-4xl"></IoAddCircle>
          </button>
        </div>
      </ActivityContext.Provider>
    </>
  );
};

export default ActivitiesProvider;

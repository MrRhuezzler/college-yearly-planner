import { createContext, useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { IoAddCircle } from "react-icons/io5";
import { PLANNER_ONE_UPDATE_DELETE } from "../utils/Endpoints";

const ActivityContext = createContext();

export const activitiesReducer = (state, action) => {
  if (action.type === "CREATE") {
    return [...state, action.data];
  } else if (action.type === "UPDATE") {
    return state.map((value, index) => {
      if (index === action.index) {
        return { ...value, ...action.data };
      } else {
        return value;
      }
    });
  } else if (action.type === "DELETE") {
    return state.filter((value, index) => index !== action.index);
  } else if (action.type === "REORDER") {
    return [...action.data.map((v) => ({ ...v }))];
  }
};

export const useActivity = () => useContext(ActivityContext);

const ActivitiesProvider = ({ value, setValue, children }) => {

  const handleActivityAction = (action) => {
    setValue(activitiesReducer(value, action));
  };

  const handleReorder = (result) => {
    console.log(result);
    if (!result.destination) return;
    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    handleActivityAction({ type: "REORDER", data: items });
  };

  // const [calculatedDates, setCalculatedDates] = useState([]);

  // const reCalculateDates = () => {
  //   const newDates = [];
  //   let date = new Date(start_date);
  //   for (let activity of value) {
  //     if (activity.type === "RELATIVE") {
  //       date.setDate(date.getDate() + activity.value);
  //       newDates.push(new Date(date));
  //       // date = calculated;
  //     } else if (activity.type === "ABSOLUTE") {
  //       date = new Date(activity.value);
  //       newDates.push(new Date(date));
  //     }
  //   }
  //   setCalculatedDates(newDates);
  // };

  // useEffect(() => {
  //   reCalculateDates();
  // }, [value, start_date]);

  return (
    <>
      <ActivityContext.Provider value={{ handleActivityAction }}>
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="activities">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="w-full flex flex-row justify-center">
          <button
            onClick={(e) => {
              handleActivityAction({
                type: "CREATE",
                data: {
                  name: "New Activity " + value.length,
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

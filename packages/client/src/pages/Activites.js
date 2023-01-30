import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillCheckCircle, AiOutlineEdit } from "react-icons/ai";
import ActivityTile from "../components/ActivityTile";
import DatePicker from "react-date-picker";
import ActivitiesProvider from "../context/ActivityContext";
import Api from "../utils/Api";
import { PLANNER_ONE_UPDATE_DELETE } from "../utils/Endpoints";
import { IoAddCircle } from "react-icons/io5";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Modal from "../components/Modal";
import FormProvider from "../context/FormContext";
import { DateTimeField, Submit, TextField } from "../components/form";

const Activities = () => {
  let { year, id } = useParams();

  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);

  const buildInitialUpdateFormData = (name, startDate) => {
    return {
      body: {
        name: {
          value: name,
          error: "",
        },
        startDate: {
          value: startDate.toISOString(),
          error: "",
        },
      },
      errors: [],
    };
  };

  const [updateFormData, setUpdateFormData] = useState({
    ...buildInitialUpdateFormData(name, startDate),
  });

  useEffect(() => {
    setUpdateFormData(buildInitialUpdateFormData(name, startDate));
  }, [name, startDate]);

  const fetchPlanner = async () => {
    const result = await Api.get(
      PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id)
    );
    const data = result.data;
    setName(data.name);
    setActivities(data.activities);
    setStartDate(new Date(data.startDate));
  };

  const updatePlanner = async (body) => {
    try {
      console.log(body);
      const result = await Api.put(
        PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id),
        { ...body }
      );
      setShowModal(false);
      return null;
    } catch (err) {
      return err.response.data.errors;
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, [showModal]);

  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between px-4">
        <div>
          <div className="mb-3 flex flex-row space-x-4">
            <h1 className="text-3xl font-semibold text-primary">
              <span className="text-secondary">{year}</span> Calendar
            </h1>
            <button
              onClick={(e) => {
                setShowModal(true);
              }}
              className="text-2xl text-secondary"
            >
              <AiOutlineEdit />
            </button>
          </div>
          <h1 className="text-3xl font-semibold text-primary">{name}</h1>
        </div>
        <div className="text-center">
          <h1 className="font-pragati text-4xl text-gray-500 mb-2">
            Start date
          </h1>
          <h2 className="text-2xl text-primary">{startDate.toDateString()}</h2>
        </div>
      </div>
      <div className="px-10 lg:px-20 space-y-4">
        <div className="w-full flex flex-row py-5 px-4 transition-all border-b-4 border-b-secondary border-t-4 border-t-secondary">
          <p className="flex-1 text-center">Name</p>
          <p className="flex-1 text-center">Type</p>
          <p className="flex-1 text-center">Value</p>
          <p className="flex-1 text-center">Calculated Date</p>
        </div>
        <ActivitiesProvider
          value={activities}
          setValue={setActivities}
          start_date={startDate}
        >
          {activities.map((activity, index) => (
            <Draggable
              key={`activity-${index}`}
              draggableId={`activity-${index}`}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <ActivityTile index={index} {...activity} />
                </div>
              )}
            </Draggable>
          ))}
        </ActivitiesProvider>
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <FormProvider
            initialData={buildInitialUpdateFormData(name, startDate)}
            formData={updateFormData}
            setFormData={setUpdateFormData}
            onSubmit={updatePlanner}
          >
            <TextField label="Name" name="name" />
            <DateTimeField label="Start Date" name="startDate" />
            <div className="text-sm text-red-500 my-4">
              {updateFormData.errors.map((msg, index) => {
                return <p key={index}>*{msg}</p>;
              })}
            </div>
            <Submit label="Update" />
          </FormProvider>
        </Modal>
      )}
    </div>
  );
};

export default Activities;

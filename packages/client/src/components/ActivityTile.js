import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-date-picker";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useActivity } from "../context/ActivityContext";
import FormProvider from "../context/FormContext";
import { DateTimeField, Submit, TextField, ToggleField } from "./form";
import Modal from "./Modal";

const ActivityTile = ({
  name: n,
  type: t,
  value: v,
  calculated_date,
  index,
  today,
}) => {
  const { handleActivityAction } = useActivity();

  const [name, setName] = useState(n);
  const [value, setValue] = useState(v);
  const [type, setType] = useState(t);

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    handleActivityAction({
      type: "UPDATE",
      index,
      data: { name, value, type },
    });
  }, [editMode]);

  return (
    <div className="my-4 bg-gray-100">
      {today && <p>today</p>}
      <div className="flex flex-row justify-between items-center py-6 px-6 text-xl outline outline-1 outline-primary rounded-lg">
        <div>
          <p className="ml-[-5px] text-gray-400 text-base mb-2">Name</p>
          {editMode ? (
            <input
              type="text"
              className={`bg-gray-100 outline rounded-sm px-2 py-1`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          ) : (
            <p>{name}</p>
          )}
        </div>
        <div>
          <p className="ml-[-5px] text-gray-400 text-base mb-2">Type</p>
          {editMode ? (
            <select
              className={`bg-gray-100 outline rounded-sm px-2 py-1`}
              value={type}
              onChange={(e) => {
                setType(e.target.value);
              }}
            >
              <option value="RELATIVE">RELATIVE</option>
              <option value="ABSOLUTE">ABSOLUTE</option>
            </select>
          ) : (
            <p>{type}</p>
          )}
        </div>
        <div>
          <p className="ml-[-5px] text-gray-400 text-base">Value</p>
          {type === "RELATIVE" ? (
            <>
              {editMode ? (
                <input
                  type="number"
                  className={`bg-gray-100 outline rounded-sm px-2 py-1`}
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                />
              ) : (
                <p>{value}</p>
              )}
            </>
          ) : (
            <>
              {editMode ? (
                <DatePicker
                  value={
                    value
                      ? !isNaN(new Date(value))
                        ? new Date(value)
                        : null
                      : value
                  }
                  onChange={(v) => {
                    if (!v) {
                      setValue(v);
                    } else {
                      setValue(v.toISOString());
                    }
                  }}
                />
              ) : (
                <p>{value}</p>
              )}
            </>
          )}
        </div>
        <div>
          <p className="ml-[-5px] text-gray-400 text-base">Final Date</p>
          <p>{calculated_date}</p>
        </div>
        <div className="space-x-6 text-2xl">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditMode(!editMode);
            }}
          >
            <AiOutlineEdit />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleActivityAction({ type: "DELETE", index });
            }}
          >
            <AiOutlineDelete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityTile;

import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useActivity } from "../context/ActivityContext";
import DatePicker from "react-date-picker";
import { GiHamburgerMenu } from "react-icons/gi";

const ActivityTile = ({ index, name: n, type: t, value: v }) => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(n);
  const [type, setType] = useState(t);
  const typePossibilities = ["RELATIVE", "ABSOLUTE"];
  const [value, setValue] = useState(v ? v : 0);
  const [preValue, setPreValue] = useState(v ? v : 0);

  // const { onDragStart, onDragEnter, onDragEnd } = dragFunc;

  const { handleActivityAction, calculatedDates } = useActivity();

  useEffect(() => {
    if (!editMode) {
      handleActivityAction({
        type: "UPDATE",
        index,
        data: { name, type, value },
      });
    }
    // console.log(calculatedDates);
  }, [editMode, value]);

  return (
    <div className="w-full flex flex-row outline items-center outline-primary rounded-lg py-5 px-4 hover:scale-[101%] focus:scale-[101%] transition-all">
      <button className="text-gray-400 cursor-move">
        <GiHamburgerMenu />
      </button>
      <div className="flex-1 grid place-items-center">
        {editMode ? (
          <div className="flex flex-row justify-center space-x-4 mb-2">
            <input
              type="text"
              style={{ width: `${name.length}ch` }}
              className={`text-xl bg-gray-100 text-primary underline focus:outline-none max-w-sm`}
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
          <h2
            onClick={(e) => {
              setEditMode(!editMode);
            }}
            className="text-xl text-center text-primary hover:cursor-pointer"
          >
            {name}
          </h2>
        )}
      </div>
      <div className="flex-1 grid place-items-center">
        {editMode ? (
          <div className="flex flex-row justify-center space-x-4 mb-2">
            <select
              onChange={(e) => {
                if (e.target.value === "ABSOLUTE") {
                  setPreValue(value);
                  setValue(new Date());
                } else {
                  setValue(preValue);
                }
                setType(e.target.value);
              }}
              className="bg-gray-100 px-4 py-2 text-lg text-primary"
            >
              {typePossibilities.map((v) => (
                <option selected={v === type}>{v}</option>
              ))}
            </select>
            <button
              onClick={(e) => {
                setEditMode(!editMode);
              }}
            >
              <AiFillCheckCircle className="text-2xl text-secondary"></AiFillCheckCircle>
            </button>
          </div>
        ) : (
          <h2
            onClick={(e) => {
              setEditMode(!editMode);
            }}
            className="text-lg text-center text-primary hover:cursor-pointer"
          >
            {type}
          </h2>
        )}
      </div>
      <div className="flex-1 grid place-items-center">
        {type === "RELATIVE" ? (
          <input
            className="bg-gray-100"
            style={{ width: `${value.toString().length + 3}ch` }}
            type="number"
            value={value}
            onChange={(e) => {
              setValue(parseInt(e.target.value));
            }}
          />
        ) : (
          <DatePicker
            value={value}
            onChange={setValue}
            className="bg-gray-100"
          />
          // <input
          //   className="bg-gray-100"
          //   type="date"
          //   value={value}
          //   onChange={(e) => {
          //     setValue(new Date(e.target.value));
          //   }}
          // />
        )}
      </div>
      <div className="flex-1 grid place-items-center">
        {calculatedDates.length > 0 &&
          new Date(calculatedDates[index]).toDateString()}
      </div>
    </div>
  );
};

export default ActivityTile;

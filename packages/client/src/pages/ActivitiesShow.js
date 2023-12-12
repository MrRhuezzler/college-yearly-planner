import { Buffer } from "buffer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillCheckCircle, AiOutlineEdit } from "react-icons/ai";
import DatePicker from "react-date-picker";
import Api from "../utils/Api";
import {
  ACTIVITY_UPDATE_ORDER,
  PLANNER_ONE_UPDATE_DELETE,
} from "../utils/Endpoints";
import Modal from "../components/Modal";
import ActivityTile from "../components/ActivityTile";
import ActivityReOrder from "../components/ActivityReOrder";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import FormProvider from "../context/FormContext";
import {
  DateTimeField,
  NumberField,
  Submit,
  TextField,
} from "../components/form";
import ActivitiesProvider from "../context/ActivityContext";
import ActivityShowTile from "../components/ActivityShowTile";

const ActivitiesShow = () => {
  let { base64 } = useParams();

  const { year, id } = JSON.parse(Buffer.from(base64, "base64").toString());
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [lastDate, setLastDate] = useState(new Date());
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [leaves, setLeaves] = useState(weekDays.map((v) => 0));

  const fetchPlanner = async () => {
    const result = await Api.get(
      PLANNER_ONE_UPDATE_DELETE.replace(":year", year).replace(":id", id)
    );
    const data = result.data;
    console.log(data);
    setName(data.name);
    setActivities(data.activities);
    setTotalWorkingDays(data.totalWorkingDays);
    setStartDate(new Date(data.startDate));
    setLastDate(new Date(data.lastDate));
    setRemainingDays(data.remainingDays);

    const holidays = data.calendar.holidays;
    const filteredHolidays = holidays.filter(
      (v) =>
        new Date(v.date).getTime() >= new Date(data.startDate).getTime() &&
        new Date(v.date).getTime() <= new Date(data.lastDate).getTime()
    );
    const _leaves = weekDays.map((v) => 0);
    filteredHolidays.forEach((v) => {
      const newV = new Date(v.date);
      const weekDay = newV.getDay();
      if (weekDay === 0 || weekDay === 6) {
        return;
      }
      _leaves[weekDay - 1] += 1;
    });
    setLeaves(_leaves);
  };

  useEffect(() => {
    fetchPlanner();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-x-hidden">
      <div className="p-6">
        <div className="mb-8 w-full flex flex-row justify-between px-4">
          <div>
            <div className="mb-3 flex flex-row space-x-4">
              <h1 className="text-3xl font-semibold text-primary">
                <span className="text-secondary">{year}</span> Calendar
              </h1>
            </div>
            <h1 className="text-3xl font-semibold text-primary">{name}</h1>
          </div>
          <div className="flex flex-row space-x-10">
            <div className="text-center">
              <h1 className="font-pragati text-4xl text-gray-500 mb-2">
                Total Working days
              </h1>
              <h2 className="text-2xl text-primary">{totalWorkingDays}</h2>
            </div>
            <div className="text-center">
              <h1 className="font-pragati text-4xl text-gray-500 mb-2">
                Start date
              </h1>
              <h2 className="text-2xl text-primary">
                {startDate.toDateString()}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex-1">
            <table className="table-fixed w-full">
              <thead className="bg-secondary text-white border-secondary border-t-2 border-x-2">
                <tr>
                  <th className="py-3">ACTIVITY NAME</th>
                  <th className="py-3">DAYS/DATE</th>
                  <th className="py-3">DAYS FROM START</th>
                  <th className="py-3">CALCULATED DATE</th>
                  <th className="py-3">DAYS LEFT <br/><span className="text-sm">(Including Holidays, Saturdays and Sundays)</span></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {activities.map((activity, index) => (
                  <tr className="border-2 border-primary whitespace-pre-wrap">
                    <ActivityShowTile key={index} {...activity} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8 w-full flex flex-row justify-between px-4 space-x-10">
          <div className="flex-1">
            <h1 className="font-pragati text-4xl text-gray-500 mb-2">
              Number of Public Holidays falling on Weekdays untill last working day
            </h1>
            <table className="w-full text-xl">
              <thead>
                <tr className="bg-primary text-white border-primary border-t-2 border-x-2">
                  {weekDays.map((v) => (
                    <th className="py-1">{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-2 border-black">
                  {leaves.map((v) => (
                    <th className="border border-black">{v}</th>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row space-x-10">
            <div className="text-center">
              <h1 className="font-pragati text-4xl text-gray-500 mb-2">
                Remaining Working days
              </h1>
              <h2 className="text-2xl text-primary">{remainingDays}</h2>
            </div>
            <div className="text-center">
              <h1 className="font-pragati text-4xl text-gray-500 mb-2">
                Last date
              </h1>
              <h2 className="text-2xl text-primary">
                {lastDate.toDateString()}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesShow;

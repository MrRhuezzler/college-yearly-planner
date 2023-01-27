import CalendarTile from "../components/CalendarTile";
import { IoAddCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import Api from "../utils/Api";
import { CALENDAR_ALL_CREATE } from "../utils/Endpoints";

const Calendar = () => {
  const [showModal, setShowModal] = useState(false);
  const [createYear, setCreateYear] = useState(new Date().getFullYear());
  const [createErrors, setCreateErrors] = useState("");

  const [calendars, setCalendars] = useState([]);

  const getAllCalendars = async () => {
    const result = await Api.get(CALENDAR_ALL_CREATE);
    return result.data;
  };

  const createCalendar = async (year) => {
    if (createYear) {
      return await Api.post(CALENDAR_ALL_CREATE, {
        year: parseInt(year),
        holidays: [],
      });
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getAllCalendars();
      setCalendars(data);
    })();
  }, [showModal]);

  return (
    <>
      <div className="p-6 flex-1 relative">
        <div className="mb-8 w-full flex flex-row justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-primary mb-2">
              <span className="text-secondary">Year</span> Calendar
            </h1>
            <h2 className="text-gray-500">Select a calendar</h2>
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
        <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {calendars.map((calendar, index) => (
            <CalendarTile key={index} {...calendar} />
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
              <h1 className="text-primary text-3xl mb-4">Year</h1>
              <input
                onChange={(e) => {
                  setCreateYear(e.target.value);
                }}
                type="number"
                value={createYear}
                s
                className="text-2xl underline text-secondary border border-primary rounded-md px-2 py-2 mb-2"
              />
              <p className="text-red-600 mb-4">{createErrors}</p>
              <div className="flex flex-row justify-center">
                <button
                  onClick={async (e) => {
                    try {
                      setCreateErrors("");
                      await createCalendar(createYear);
                      setShowModal(false);
                    } catch (e) {
                      setCreateErrors("please check year");
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
    </>
  );
};

export default Calendar;

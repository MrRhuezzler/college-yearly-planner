import CalendarTile from "../components/CalendarTile";
import { IoAddCircle } from "react-icons/io5";

const Calendar = () => {
  const arrays = [
    2020, 2021, 2022, 2023, 2024, 2023, 2023, 2023, 2023, 2023, 2023,
  ];
  return (
    <div className="p-6">
      <div className="mb-8 w-full flex flex-row justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            Year Calendar
          </h1>
          <h2 className="text-gray-500">Select the year</h2>
        </div>
        <div className="flex flex-col justify-center">
          <button className="text-primary text-4xl">
            <IoAddCircle></IoAddCircle>
          </button>
        </div>
      </div>
      <div className="px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {arrays.map((v) => (
          <CalendarTile year={v.toString()} isCurrent={v == 2020} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;

const CalendarTile = ({ year, isCurrent }) => {
  return (
    <div
      className={`group relative aspect-square border-4 rounded-lg ${
        isCurrent ? "border-secondary" : "border-primary"
      } p-5 flex flex-col justify-end ${
        isCurrent ? "hover:bg-secondary" : "hover:bg-primary"
      } ${
        isCurrent ? "focus:bg-secondary" : "focus:bg-primary"
      } hover:cursor-pointer`}
    >
      <div
        className={`absolute ${
          isCurrent ? "bg-secondary" : "bg-primary"
        } w-[50%] aspect-square left-0 top-0 triangle`}
      ></div>
      <p
        className={`text-4xl font-light ${
          isCurrent ? "text-secondary" : "text-primary"
        } text-right relative`}
      >
        {year.substr(0, 2)}
        <span className="text-7xl group-hover:text-white font-semibold">
          {year.substr(2)}
        </span>
      </p>
    </div>
  );
};

export default CalendarTile;

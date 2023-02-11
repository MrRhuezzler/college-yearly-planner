const addWeekdaysWithoutHolidays = (holidays, startDate, days) => {
  console.log(holidays);
  let currentDate = startDate;
  console.log(currentDate.toDateString);
  let count = 0;
  while (count < days) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (
      holidays.includes(currentDate.toDateString()) ||
      currentDate.getDay() === 0 ||
      currentDate.getDay() === 6
    ) {
      continue;
    }

    count++;
  }

  return currentDate;
};

module.exports = {
  addWeekdaysWithoutHolidays,
};

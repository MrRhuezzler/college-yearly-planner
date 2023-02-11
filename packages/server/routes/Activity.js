const router = require("express").Router();
const { body } = require("express-validator");
const { addWeekdaysWithoutHolidays } = require("../utils");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");

const baseURL = "/:year/planner/:id";

router.post(
  baseURL + "/addWorkingDays",
  validateRequest([
    body("startDate")
      .exists()
      .withMessage("Start Date is missing")
      .isISO8601()
      .withMessage("Start Date must be a valid date"),
    body("days")
      .exists()
      .withMessage("Days is missing")
      .isNumeric()
      .withMessage(
        "Days must be a number, representing the total working days"
      ),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const { startDate: date, days } = req.body;
      const calendar = prisma.calendar.findUnique({ where: { year } });
      const holidays = calendar.holidays;

      const startDate = new Date(date);
      console.log("s", startDate.toLocaleDateString());

      console.log(startDate.toISOString());

      let lastDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => v.date),
        startDate,
        days
      );

      console.log(lastDate);
      res.send({ date: lastDate });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

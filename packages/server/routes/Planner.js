const router = require("express").Router();
const { body, param, query } = require("express-validator");
const {
  addWeekdaysWithoutHolidays,
  differenceWeekdaysWithHolidays,
} = require("../utils");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");
const puppeteer = require("puppeteer");
const nunjucks = require("nunjucks");
const EXPORT_HTML = require("../html/export");

const baseURL = "/:year/planner";

router.get(
  baseURL,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    const { year } = req.params;
    try {
      const plans = await prisma.planner.findMany({
        orderBy: { id: "desc" },
        where: {
          calendarYear: year,
        },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      for (let i = 0; i < plans; i++) {
        const today = new Date();
        const lastDate = new Date(plans[i].lastDate);
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);
        const holidays = plans[i].calendar.holidays;
        const remainingDays = differenceWeekdaysWithHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          today,
          lastDate
        );
        plans[i] = { ...plans[i], remainingDays };
      }

      res.send(plans);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  `${baseURL}/exportMany`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    query("planners").isString(),
    query("name").isString(),
  ]),
  async (req, res, next) => {
    try {
      const { planners, name } = req.query;

      const plannersIds = planners.split(",").map((v) => Number(v));

      const plannerObjects = await prisma.planner.findMany({
        where: {
          id: {
            in: plannersIds
          }
        },
        include: {
          activities: { orderBy: { order: "asc" } }, calendar: true
        }
      });

      plannerObjects.sort((a, b) => plannersIds.indexOf(a.id) - plannersIds.indexOf(b.id));

      if (plannerObjects.length <= 0) {
        throw new Error("Add some planners to export");
      }

      let startDate = plannerObjects[0].startDate;
      let lastDate = plannerObjects[plannerObjects.length - 1].lastDate;

      // let activities = plannerObjects.map((p) => p.activities.map((activity) => {
      //   const relativeToStart = differenceWeekdaysWithHolidays(
      //     (p.calendar.holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
      //     p.startDate,
      //     activity.date,
      //   )

      //   return {
      //     ...activity,
      //     relativeToStart
      //   }
      // }));

      // activities = [].concat.apply([], activities);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

      const TEMPLATE = nunjucks.compile(EXPORT_HTML);
      const PAGE_SOURCE = TEMPLATE.render({
        name: name,
        planners: plannerObjects.map((planner) => {
          const holidays = planner.calendar.holidays;
          const filteredHolidays = holidays.filter((v) => new Date(v.date).getTime() >= planner.startDate.getTime() && new Date(v.date).getTime() <= planner.lastDate.getTime());
          const leaves = weekDays.map((v) => (0));
          filteredHolidays.forEach((v) => {
            const newV = new Date(v.date);
            const weekDay = newV.getDay();
            if (weekDay === 0 || weekDay === 6) {
              return;
            }
            leaves[weekDay - 1] += 1;
          });

          let newActivities = planner.activities.map((activity) => {
            const relativeToStart = differenceWeekdaysWithHolidays(
              (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
              new Date(planner.startDate),
              activity.date,
            )
            return { name: activity.name, date: `${months[activity.date.getMonth()]} ${activity.date.getDate()}, ${activity.date.getFullYear()}`, relativeToStart }
          });

          return {
            leaves,
            name: planner.name,
            activities: newActivities
          }
        }),
        // activities: activities.map((activity) => {
        //   const date = new Date(activity.date);
        //   date.setHours(0, 0, 0, 0);
        //   console.log(activity.date);
        //   console.log(date.toDateString());
        //   console.log("----");
        //   `${months[activity.date.getMonth()]} ${activity.date.getDate()}, ${activity.date.getFullYear()}`
        //   return { name: activity.name, date: `${months[activity.date.getMonth()]} ${activity.date.getDate()}, ${activity.date.getFullYear()}`, relativeToStart: activity.relativeToStart }
        // }),
        today: new Date().toLocaleDateString("en-us", { year: "numeric", month: "long", day: "numeric" }),
        academicYear: `${startDate.getFullYear()} - ${lastDate.getFullYear()}`
      });

      const page = await browser.newPage();
      await page.setContent(PAGE_SOURCE);
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          bottom: 30,
          left: 30,
          top: 30,
          right: 30,
        }
      });
      await browser.close();

      res.attachment(`${name}(${startDate.getFullYear()}-${lastDate.getFullYear()}).pdf`);
      res.contentType("application/pdf");
      res.send(pdf);
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  `${baseURL}/:id/export`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let plannerobj = await prisma.planner.findUnique({
        where: {
          id: Number(id),
        },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      const today = new Date();
      const lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);

      const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, remainingDays };

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      const TEMPLATE = nunjucks.compile(EXPORT_HTML);
      const PAGE_SOURCE = TEMPLATE.render({
        name: plannerobj.name,
        activities: plannerobj.activities.map((activity) => ({ name: activity.name, date: activity.date.toLocaleDateString("en-us", { year: "numeric", month: "long", day: "numeric" }) })),
        today: new Date().toLocaleDateString("en-us", { year: "numeric", month: "long", day: "numeric" }),
        academicYear: `${plannerobj.startDate.getFullYear()} - ${plannerobj.startDate.getFullYear() + 1}`
      });

      await page.setContent(PAGE_SOURCE);
      const pdf = await page.pdf({
        format: "A4",
        margin: {
          bottom: 30,
          left: 30,
          top: 30,
          right: 30,
        }
      });
      await browser.close();

      res.attachment(`${plannerobj.name}(${plannerobj.startDate.getFullYear()}-${plannerobj.startDate.getFullYear() + 1}).pdf`);
      res.contentType("application/pdf");
      res.send(pdf);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  `${baseURL}/:id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let plannerobj = await prisma.planner.findUnique({
        where: {
          id: Number(id),
        },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      const today = new Date();
      const lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);

      const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      const newActivities = plannerobj.activities.map((activity) => {
        if (activity.date) {
          const relativeToStart = differenceWeekdaysWithHolidays(
            (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
            plannerobj.startDate,
            activity.date,
          )

          return {
            ...activity,
            relativeToStart
          }
        }

        return {
          ...activity,
          relativeToStart: null
        }
      })

      plannerobj = { ...plannerobj, activities: newActivities, remainingDays };

      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  baseURL,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("startDate")
      .exists()
      .withMessage("Start Date is missing")
      .isISO8601()
      .withMessage("Start Date must be a valid date"),
    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("totalWorkingDays")
      .isNumeric()
      .withMessage("Total working days must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    const { year } = req.params;
    try {
      const calendar = await prisma.calendar.findUnique({
        where: { year },
      });

      const holidays = calendar.holidays;
      const lastDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        req.body.startDate,
        req.body.totalWorkingDays
      );

      let plannerobj = await prisma.planner.create({
        data: {
          ...req.body,
          lastDate,
          calendarYear: year,
        },
        include: {
          activities: { orderBy: { order: "asc" } },
        },
      });

      const DEFAULT_ACTIVITES = [
        {
          "name": "Reopening for the Academic year 2023-24",
          "relativeDays": 0
        },
        {
          "name": "Attendance Review 1",
          "relativeDays": 20
        },
        {
          "name": "Intermediate Feedback 1",
          "relativeDays": 2
        },
        {
          "name": "CA 1 From",
          "relativeDays": 18
        },
        {
          "name": "CA 1 Mark Entry",
          "relativeDays": 10
        },
        {
          "name": "Attendance Review 2",
          "relativeDays": 20
        },
        {
          "name": "Intermediate Feedback 2",
          "relativeDays": 2
        },
        {
          "name": "CA 2 From",
          "relativeDays": 15
        },
        {
          "name": "CA 2 Mark Entry",
          "relativeDays": 2
        },
        {
          "name": "Attendance Review - Final",
          "relativeDays": 8
        },
        {
          "name": "End Semester Exam",
          "relativeDays": 0
        },
        {
          "name": "Commencement of Classes for Even Semester",
          "relativeDays": 20
        }
      ];

      let startDate = new Date(plannerobj.startDate);
      const calculatedDates = [];
      for (let i = 0; i < DEFAULT_ACTIVITES.length; i++) {
        const defaultAct = DEFAULT_ACTIVITES[i];
        const newDate = addWeekdaysWithoutHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          startDate,
          defaultAct.relativeDays
        );
        calculatedDates.push(newDate);
        startDate = newDate;
      }

      const defaultActs = await Promise.all(DEFAULT_ACTIVITES.map((act, index) => {
        return prisma.activity.create({
          data: {
            name: act.name,
            relativeDays: act.relativeDays,
            plannerId: plannerobj.id,
            order: index,
            type: "RELATIVE",
            date: calculatedDates[index]
          }
        })
      }));

      const today = new Date();
      // lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      // const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, activities: defaultActs, remainingDays };

      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  `${baseURL}/:id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let plannerobj = await prisma.planner.delete({
        where: {
          id: Number(id),
        },
        include: { activities: { orderBy: { order: "asc" } } },
      });
      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  `${baseURL}/:id`,
  validateRequest([
    param("year")
      .isNumeric()
      .withMessage("Year must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    param("id")
      .isNumeric()
      .withMessage("Id must be a valid number")
      .customSanitizer((value, { req }) => Number(value)),
    body("startDate")
      .exists()
      .withMessage("Start Date is missing")
      .isISO8601()
      .withMessage("Start Date must be a valid date"),
    body("name")
      .isString()
      .withMessage("Name must be string")
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("totalWorkingDays")
      .isNumeric()
      .withMessage("Total working days must be a valid number"),
  ]),
  async (req, res, next) => {
    try {
      const { year, id } = req.params;

      const calendar = await prisma.calendar.findUnique({
        where: { year },
      });

      let holidays = calendar.holidays;
      const lastDate = addWeekdaysWithoutHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        req.body.startDate,
        req.body.totalWorkingDays
      );

      let plannerobj = await prisma.planner.update({
        where: {
          id,
        },
        data: { ...req.body, lastDate },
        include: { activities: { orderBy: { order: "asc" } }, calendar: true },
      });

      let startDate = new Date(plannerobj.startDate);
      holidays = plannerobj.calendar.holidays;
      const acitivites = plannerobj.activities;

      const calculatedDates = [];

      for (let i = 0; i < acitivites.length; i++) {
        const foundActivity = acitivites[i];
        const newDate = addWeekdaysWithoutHolidays(
          (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
          startDate,
          foundActivity.relativeDays
        );
        calculatedDates.push({ id: foundActivity.id, date: newDate });
        startDate = newDate;
      }

      const updatedActivities = await Promise.all(
        calculatedDates.map((v, index) => {
          return prisma.activity.update({
            where: {
              id: v.id,
            },
            data: {
              date: v.date,
              order: index,
            },
          });
        })
      );

      const today = new Date();
      // lastDate = new Date(plannerobj.lastDate);
      today.setHours(0, 0, 0, 0);
      lastDate.setHours(0, 0, 0, 0);
      // const holidays = plannerobj.calendar.holidays;
      const remainingDays = differenceWeekdaysWithHolidays(
        (holidays || []).map((v) => new Date(v.date).toLocaleDateString()),
        today,
        lastDate
      );

      plannerobj = { ...plannerobj, remainingDays };

      res.send({ ...plannerobj, activities: updatedActivities });
    } catch (error) {
      next(error);
    }
  }
);

// router.patch(
//   `${baseURL}/:id`,
//   validateRequest([
//     param("year").isNumeric().withMessage("Year must be a valid number"),
//     body("activities").isArray().withMessage("Acitivites must be an array"),
//   ]),
//   async (req, res, next) => {
//     try {
//       const { id } = req.params;
//       const plannerobj = await prisma.planner.update({
//         where: {
//           id: Number(id),
//         },
//         data: req.body,
//       });
//       res.send(plannerobj);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = router;

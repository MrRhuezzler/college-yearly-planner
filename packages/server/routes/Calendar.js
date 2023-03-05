const router = require("express").Router();
const { body, param } = require("express-validator");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");

router.get("/", async (req, res, next) => {
  try {
    const cals = await prisma.calendar.findMany({
      orderBy: {
        year: "desc",
      },
      include: { planner: true },
    });
    res.send(cals);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:year",
  validateRequest([
    param("year").isNumeric().withMessage("Year must be a valid number"),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.findUnique({
        where: {
          year: Number(year),
        },
        include: { Planner: true },
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  validateRequest([
    body("year").isNumeric().withMessage("Year must be a valid number"),
    body("holidays").isArray().withMessage("Holidays must be an array"),
  ]),
  async (req, res, next) => {
    try {
      const yrCal = await prisma.calendar.create({
        data: req.body,
      });
      res.send(yrCal);
    } catch (error) {
      next({
        status: 400,
        message: `${req.body.year} calendar already exists`,
      });
    }
  }
);

router.delete(
  "/:year",
  validateRequest([
    param("year").isNumeric().withMessage("Year must be a valid number"),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.delete({
        where: {
          year: Number(year),
        },
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:year",
  validateRequest([
    param("year").isNumeric().withMessage("Year must be a valid number"),
    body("holidays").isArray().withMessage("Holidays must be an array"),
  ]),
  async (req, res, next) => {
    try {
      const { year } = req.params;
      const yrCal = await prisma.calendar.update({
        where: {
          year: Number(year),
        },
        data: req.body,
      });
      res.send(yrCal);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

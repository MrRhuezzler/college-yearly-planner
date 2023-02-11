const router = require("express").Router();
const { body } = require("express-validator");
const prisma = require("../utils/dbClient");
const validateRequest = require("../utils/validateRequest");

const baseURL = "/:year/planner";

router.get(baseURL, async (req, res, next) => {
  try {
    const plans = await prisma.planner.findMany({ orderBy: { id: "desc" } });
    res.send(plans);
  } catch (error) {
    next(error);
  }
});

router.get(baseURL + "/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const plannerobj = await prisma.planner.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.send(plannerobj);
  } catch (error) {
    next(error);
  }
});

router.post(
  baseURL,
  validateRequest([
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
  ]),
  async (req, res, next) => {
    const { year } = req.params;
    console.log(req.body);
    try {
      const plannerobj = await prisma.planner.create({
        data: {
          ...req.body,
          calendarYear: parseInt(year),
        },
      });
      res.send(plannerobj);
    } catch (error) {
      next({
        status: 400,
        message: `Something went wrong.`,
      });
    }
  }
);

router.delete(baseURL + "/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const plannerobj = await prisma.planner.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(plannerobj);
  } catch (error) {
    next(error);
  }
});

router.put(
  baseURL + "/:id",
  validateRequest([
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
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const plannerobj = await prisma.planner.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  baseURL + "/:id",
  validateRequest([
    body("activities").isArray().withMessage("Acitivites must be an array"),
  ]),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const plannerobj = await prisma.planner.update({
        where: {
          id: Number(id),
        },
        data: req.body,
      });
      res.send(plannerobj);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

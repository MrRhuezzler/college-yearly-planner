const router = require("express").Router();
const prisma = require("../utils/dbClient");

router.get("/:year/planner", async (req, res, next) => {
  try {
    const plans = await prisma.planner.findMany({ orderBy: { id: "desc" } });
    res.send(plans);
  } catch (error) {
    next(error);
  }
});

router.get("/:year/planner/:id", async (req, res, next) => {
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

router.post("/:year/planner", async (req, res, next) => {
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
    next(error);
  }
});

router.delete("/:year/planner/:id", async (req, res, next) => {
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

router.patch("/:year/planner/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
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
});

module.exports = router;

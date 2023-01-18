const router = require("express").Router();
const prisma = require("../utils/dbClient");

router.get("/", async (req, res, next) => {
  try {
    const cals = await prisma.calendar.findMany({
      orderBy: {
        year: "asc",
      },
      include: { planner: true },
    });
    res.send(cals);
  } catch (error) {
    next(error);
  }
});

router.get("/:year", async (req, res, next) => {
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
});

router.post("/", async (req, res, next) => {
  try {
    const yrCal = await prisma.calendar.create({
      data: req.body,
    });
    res.send(yrCal);
  } catch (error) {
    next(error);
  }
});

router.delete("/:year", async (req, res, next) => {
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
});

router.patch("/:year", async (req, res, next) => {
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
});

router.use("/:year/planner", require("./Planner"));

module.exports = router;

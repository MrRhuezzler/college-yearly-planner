const router = require("express").Router();
const prisma = require("../utils/dbClient");

router.get("/", async (req, res, next) => {
  try {
    const plans = await prisma.planner.findMany({ orderBy: { id: "asc" } });
    res.send(plans);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
  try {
    const plannerobj = await prisma.planner.create({
      data: req.body,
    });
    res.send(plannerobj);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
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

router.patch("/:id", async (req, res, next) => {
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
});

module.exports = router;

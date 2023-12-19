const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const notFound = require("../errors/notFound");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");


router.use("/:movieId/theaters", theatersRouter)
router.use("/:movieId/reviews", reviewsRouter)
router.route("/:movieId/critics").all(notFound)

router.route("/:movieId")
  .get(controller.read)
  .all(methodNotAllowed);


router.route("/")
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;

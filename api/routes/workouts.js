var express = require("express");
var router = express.Router();

const workouts = require("../controllers/workouts.controller.js");

router.get("/", workouts.findAll);

router.get("/:id", workouts.findOne);

router.post("/refresh", workouts.refreshWorkouts);

module.exports = router;
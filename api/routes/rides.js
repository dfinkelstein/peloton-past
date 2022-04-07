var express = require('express');
var router = express.Router();

const rides = require("../controllers/rides.controller")

router.get("/:id", rides.getRideByID);

module.exports = router;
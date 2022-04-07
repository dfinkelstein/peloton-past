var express = require('express');
var router = express.Router();

const users = require("../controllers/users.controller")

/* GET users listing. */
router.get('/', users.getAuthenticatedUser);

router.get("/:id", users.findOne);

router.post("/update", users.updateUserInfo);

module.exports = router;

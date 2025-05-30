const express = require("express");
const { getAllUsers, getUser, addUser } = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllUsers).post(addUser);
router.route("/:id").get(getUser);

module.exports = router;

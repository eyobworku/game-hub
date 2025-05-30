const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  if (!users || users.length === 0) {
    return next(new ErrorResponse("No users found", 404));
  }

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc      Get all users
// @route     GET /api/v1/users
// @access    //Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`No user with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: [user],
  });
});

exports.addUser = asyncHandler(async (req, res, next) => {
  User.findOne({ name: req.body.name })
    .then(async (user) => {
      if (!user) {
        const user = await User.create(req.body);
        res.status(201).json({
          success: true,
          data: user,
        });
        return;
      }
      res.status(201).json({
        success: true,
        data: user,
      });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
    });
});

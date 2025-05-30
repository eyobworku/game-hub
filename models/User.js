const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);

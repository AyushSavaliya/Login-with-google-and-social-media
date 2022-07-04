const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const loginSchema = mongoose.Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  profilePhoto: String,
  password: String,
  source: { type: String, required: [true, "source not specified"] },
  lastVisited: { type: Date, default: new Date() },
  tokens: [{
    token: {
      type: String
    }
  }]
});

loginSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id }, "userGenretToken");
    this.tokens = await this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = mongoose.model("user", loginSchema);
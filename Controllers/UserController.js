const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const SystemResponse = require("../utils/response-handler/SystemResponse");

class UserController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json(SystemResponse.notFound("Username does not exist"));
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(400)
          .send(SystemResponse.badRequest("Password does not match"));
      }

      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });

      return res.status(200).send(
        SystemResponse.success("Login successful", {
          email: user.email,
          name: user.name,
          token: `Bearer ${token}`,
        })
      );
    } catch (err) {
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("Error in login", err));
    }
  }
  static async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPass,
      });
      return res
        .status(201)
        .send(SystemResponse.createsuccess("Signup successful", newUser));
    } catch (err) {
      return res
        .status(500)
        .send(SystemResponse.getErrorResponse("Error in signup", err));
    }
  }
}

module.exports = UserController;

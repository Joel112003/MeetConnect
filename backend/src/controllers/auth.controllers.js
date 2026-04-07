import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Email already exists",
      });
    }

    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    // remove sensitive data
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("Error registering user:", err.message);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(httpStatus.OK).json({
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("Error logging in user:", err.message);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while logging in",
    });
  }
};

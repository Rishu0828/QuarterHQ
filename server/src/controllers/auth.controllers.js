import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth.js";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await userModel.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
    });

    const { accessToken, refreshToken } = generateToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(201).json({
      message: "User Register Successfully...!",

      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("Register user error : ", error);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = generateToken({ userId: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).json({
      message: "User Login Successfully...!",

      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("Login error : ", error);
  }
}



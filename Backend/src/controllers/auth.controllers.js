import { db } from "../libs/db.js";
import userRole from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { email, password, name } = req.body;

  // checking existing user
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // hashing password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // new user creation
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole.USER,
      },
    });

    // creating token
    const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // saving in cookies
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(201).json({
      success: true,
      message: "user added successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("error creating user :", error);
    res.status(500).json({
      message: "error creating user",
    });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(401).json({
        error: "user not found",
      });
    }

    //password matching
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        message: "invalid credentials",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("error logging user :", error);
    res.status(500).json({
      message: "error logging user",
    });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });
    res.status(200).json({
      success: true,
      message: "user logged out successfully",
    });
    
  } catch (error) {
    console.error("error logging out user :", error);
    res.status(500).json({
      message: "error logging out user",
    });
  }
};
const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "user authentication successfully done",
      user: req.user,
    });
  } catch (error) {
    console.error("error authenticating :", error);
    res.status(500).json({
      message: "error authenticating",
    });
  }
};

export { register, login, logout, check };

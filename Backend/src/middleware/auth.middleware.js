import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import user from "../generated/prisma/index.js";


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        message: "No token provided!",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      res.status(401).json({
        message: "UnAuthorized access token provided!",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
    
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({
      error: "error while authenticating",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  const userId = req.user.id; // remember here get id from req.user after the authmiddleware.
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access Denied - Admin Only",
      });
    }
    next();
  } catch (error) {
    res.status(503).status({
      error: "error checking admin role",
    });
    console.log("error while checking admin", error);
  }
};

import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protects routes by verifying the JWT sent in the Authorization header.
 * On success, attaches the authenticated user (minus password) to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User no longer exists");
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token invalid"));
    }
  }

  res.status(401);
  next(new Error("Not authorized, no token provided"));
};

/**
 * Restricts a route to admin users only. Must be used after `protect`.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  next(new Error("Not authorized as an admin"));
};

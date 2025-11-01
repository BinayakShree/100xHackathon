import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role: "TOURIST" | "TUTOR";
}

/**
 * Optional authentication middleware - doesn't fail if no token is provided
 * Sets req.user if a valid token is present, otherwise continues without setting it
 */
export const optionalAuthenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // If no auth header, continue without setting req.user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      // If JWT_SECRET is missing, just continue without authentication
      return next();
    }

    try {
      // Verify token - if valid, attach user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
    } catch (error) {
      // If token is invalid, just continue without setting req.user
      // Don't fail the request
    }

    next(); // Proceed to the next middleware / route handler
  } catch (error) {
    // On any error, just continue without authentication
    next();
  }
};


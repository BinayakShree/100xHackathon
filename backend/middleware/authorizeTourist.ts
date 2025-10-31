import type { Request, Response, NextFunction } from "express";

export const authorizeTourist = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ensure user info exists
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Not authenticated" });
  }

  // Check role
  if (req.user.role !== "TOURIST") {
    return res.status(403).json({ error: "Access denied: Tourists only" });
  }

  next();
};

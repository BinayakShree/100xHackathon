import type { Request, Response, NextFunction } from "express";

export const authorizeTutor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Not authenticated" });
  }

  if (req.user.role !== "TUTOR") {
    return res.status(403).json({ error: "Access denied: Tutors only" });
  }

  next();
};

import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import bookingRoutes from "./routes/bookingRoute";
import categoryRoutes from "./routes/categoryRoutes";
import notificationRoutes from "./routes/notificationroutes";
import reviewsRoute from "./routes/reviewroute";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/reviews", reviewsRoute);
app.get("/", (req, res) => {
  res.send("Express + Prisma + NeonDB API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

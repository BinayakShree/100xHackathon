import { Bindings } from "./utils/binding";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRouter } from "./routers/auth.routes";
const app = new Hono<{ Bindings: Bindings }>();
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Welcome to Arogya Backend API",
    data: null,
  });
});
app.route("/arogya/api/v1/auth", authRouter);

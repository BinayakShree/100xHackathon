import { Hono } from "hono";
import registerToursitController from "../controllers/authControllers/registerToursitController";
export const authRouter = new Hono();
authRouter.post("/registerTourist", registerToursitController);

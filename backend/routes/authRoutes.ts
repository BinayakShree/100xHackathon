import { Router } from "express";
import { registerToursitController } from "../controllers/registerToursitController";
const router = Router();

router.post("/registerToursit", registerToursitController);
export default router;

import { Router } from "express";
import { registerUserController } from "../controllers/registerUserController";
import { loginUserController } from "../controllers/loginUserController";
const router = Router();

router.post("/registerUser", registerUserController);
router.post("/loginTourist", loginUserController);
export default router;

import express from "express";
import { signin, register, signout } from "../../controllers/auth.controller";
import { refreshtoken } from "../../controllers/refreshtoken.controller";
import { validateShcema } from "../../middleware/validationSchema";
import { LoginSchema, RegisterSchema } from "../../schema/user";

const router = express.Router();

router.post("/signin", validateShcema(LoginSchema), signin);
router.post("/register", validateShcema(RegisterSchema), register);
router.get("/refresh", refreshtoken);
router.get("/signout", signout);

export default router;

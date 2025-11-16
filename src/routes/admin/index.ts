import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { USER_ROLE } from "../../utils/enums";

import AdminUserRouter from "./users";
import AdminExerciseRouter from "./exercises";
import AdminProgramRouter from "./programs";

const router = Router();

router.use(authenticate, authorize(USER_ROLE.ADMIN));
router.use("/users", AdminUserRouter());
router.use("/exercises", AdminExerciseRouter());
router.use("/programs", AdminProgramRouter());

export default () => router;

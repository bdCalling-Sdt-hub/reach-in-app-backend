import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { VisitorController } from "./visitor.controller";
const router = express.Router();
router.route("/")
    .get(
        auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
        VisitorController.visitorList
    )

export const VisitorRoutes = router;
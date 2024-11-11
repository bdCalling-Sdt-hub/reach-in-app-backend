import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { PackageController } from "./package.controller";
import validateRequest from "../../middlewares/validateRequest";
import { PackageValidation } from "./package.validation";
const router = express.Router()

router
    .route("/")
    .post( 
        validateRequest(PackageValidation.createPackageZodSchema), 
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), 
        PackageController.createPackage
    )
    .get(PackageController.getPackage)

router
    .route("/:id")
    .patch(auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), PackageController.updatePackage)

export const PackageRoutes = router;
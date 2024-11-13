import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { PeopleValidation } from "./people.validation";
import validateRequest from "../../middlewares/validateRequest";
import { PeopleController } from "./people.controller";
import csv from "csvtojson";
import { IPeople } from "./people.interface";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(PeopleValidation.createPeopleZodSchema),
        PeopleController.createPeople
    )
    .get(
        PeopleController.getPeople
    );

router.route("/:id")
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        PeopleController.deleteSinglePeople
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(PeopleValidation.updatePeopleZodSchema),
        PeopleController.updateSinglePeople
    );

router.route("/bulk")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                let people: IPeople[] = [];

                // Check if the CSV file exists in the request
                if (req.files && "csv" in req.files && req.files.csv[0]) {
                    // Parse the CSV file into an array of people objects
                    people = await csv().fromFile(req.files.csv[0].path);
                } else {
                    return res.status(400).json({ message: "CSV file is required." });
                }

                req.body = { people };
                next();

            } catch (error) {
                return res.status(500).json({ message: "An error occurred while processing the CSV file." });
            }
        },
        PeopleController.createBulkPeople
    )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        PeopleController.deleteBulkPeople
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(PeopleValidation.updatePeopleZodSchema),
        PeopleController.updateBulkPeople
    );

export const PeopleRoutes = router;
import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
import { CompanyValidation } from "./company.validation";
import validateRequest from "../../middlewares/validateRequest";
import { CompanyController } from "./company.controller";
import csv from "csvtojson";
import { ICompany } from "./company.interface";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(CompanyValidation.createCompanyZodSchema),
        CompanyController.createCompany
    )
    .get(
        CompanyController.getCompany
    );

router.route("/:id")
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        CompanyController.deleteSingleCompany
    )
    .get(
        CompanyController.companyDetails
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(CompanyValidation.updateCompanyZodSchema),
        CompanyController.updateSingleCompany
    );

router.route("/bulk")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        async (req: Request, res: Response, next: NextFunction) => {

            try {
                let people: ICompany[] = [];

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
        CompanyController.createBulkCompany
    )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        CompanyController.deleteBulkCompany
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN),
        fileUploadHandler(),
        validateRequest(CompanyValidation.updateCompanyZodSchema),
        CompanyController.updateBulkCompany
    );

export const CompanyRoutes = router;
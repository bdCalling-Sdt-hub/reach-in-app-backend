import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { StoryController } from "./story.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StoryValidation } from "./story.validation";
import fileUploadHandler from "../../middlewares/fileUploaderHandler";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        (req: Request, res: Response, next: NextFunction) => {
            const payload = req.body;
            console.log(req.files)
            let image;
            if (req.files && 'image' in req.files && req.files.image[0]) {
                image = `/images/${req.files.image[0].filename}`;
            }

            req.body = {...payload, image};
            next();
        },
        validateRequest(StoryValidation.createStoryZodSchema),
        StoryController.createStory
    )
    .get(
        StoryController.getStory
    );

router.route("/:id")
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        StoryController.updateStory
    )
    .get(
        StoryController.storyDetails
    )
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        StoryController.deleteStory
    );


export const StoryRoutes = router;
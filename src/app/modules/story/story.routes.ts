import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLES } from "../../../enums/user";
import { StoryController } from "./story.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StoryValidation } from "./story.validation";
const router = express.Router();

router.route("/")
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
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
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        StoryController.deleteStory
    );


export const StoryRoutes = router;
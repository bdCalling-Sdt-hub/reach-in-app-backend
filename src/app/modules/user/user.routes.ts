import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();

router.get(
    '/profile',
    auth(USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.SUPER_ADMIN),
    UserController.getUserProfile
);

router
    .route('/')
    .post(
        UserController.createUser
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.USER),
        fileUploadHandler(),
        UserController.updateProfile
    );

router.get("/:id",
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    UserController.companyProfile
)

export const UserRoutes = router;
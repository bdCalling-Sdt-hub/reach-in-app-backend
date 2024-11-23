import express, { Request, Response, NextFunction } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BlogController } from './blog.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BlogValidation } from './blog.validation';
import fileUploadHandler from '../../middlewares/fileUploaderHandler';
const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        (req: Request, res: Response, next: NextFunction) => {
            const payload = req.body;
            let image;
            if (req.files && 'image' in req.files && req.files.image[0]) {
                image = `/images/${req.files.image[0].filename}`;
            }

            req.body = {...payload, image};
            next();
        },
        validateRequest(BlogValidation.createBlogZodSchema),
        BlogController.createBlog
    )
    .get(
        BlogController.getBlogs
    );

router
    .route('/:id')
    .delete(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        BlogController.deleteBlog
    )
    .get(
        BlogController.blogDetails
    )
    .patch(
        auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
        fileUploadHandler(),
        (req: Request, res: Response, next: NextFunction) => {
            const payload = req.body;
            let image;
            if (req.files && 'image' in req.files && req.files.image[0]) {
                image = `/images/${req.files.image[0].filename}`;
            }

            req.body = {...payload, image};
            next();
        },
        BlogController.updateBlog
    );

export const BlogRoutes = router;
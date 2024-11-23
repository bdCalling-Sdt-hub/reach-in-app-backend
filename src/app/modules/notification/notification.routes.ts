import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';
const router = express.Router();

router.route("/")
  .get(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN ),
    NotificationController.getNotificationFromDB
  )
  .patch(
    auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
    NotificationController.readNotification
  )


export const NotificationRoutes = router;

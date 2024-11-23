import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { FaqRoutes } from '../modules/faq/faq.route';
import { RuleRoutes } from '../modules/rule/rule.route';
import { PackageRoutes } from '../modules/package/package.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { BlogRoutes } from '../modules/blog/blog.route';
import { StoryRoutes } from '../modules/story/story.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
import { ContactRoutes } from '../modules/contact/contact.routes';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/faq", route: FaqRoutes },
    { path: "/rule", route: RuleRoutes },
    { path: "/package", route: PackageRoutes },
    { path: "/admin", route: AdminRoutes },
    { path: "/blog", route: BlogRoutes },
    { path: "/story", route: StoryRoutes },
    { path: "/subscription", route: SubscriptionRoutes },
    { path: "/notification", route: NotificationRoutes },
    { path: "/contact", route: ContactRoutes },
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;
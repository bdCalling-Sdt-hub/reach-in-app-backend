import { INotification } from './notification.interface';
import { Notification } from './notification.model';

// get notifications
const getNotificationFromDB = async (query: Record<string, unknown>): Promise<INotification[]> => {
  const { limit, page } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Notification.find()
    .skip(skip)
    .limit(size);

  const unreadCount = await Notification.countDocuments({ read: false });
  const count = await Notification.countDocuments();

  const data: any = {
    result,
    unreadCount,
    meta: {
      page: page,
      total: count,
      limit: limit
    }
  };

  return data;
};

// read notifications only for user
const readNotificationToDB = async (): Promise<INotification | undefined> => {
  const result: any = await Notification.updateMany({ read: true });
  return result;
};


export const NotificationService = {
  getNotificationFromDB,
  readNotificationToDB,
};

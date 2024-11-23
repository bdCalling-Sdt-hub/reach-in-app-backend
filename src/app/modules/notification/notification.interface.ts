import { Model, Types } from 'mongoose';

export type INotification = {
  text: string;
  link: string;
  read: boolean;
};

export type NotificationModel = Model<INotification>;

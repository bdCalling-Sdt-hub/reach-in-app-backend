import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { Subscription } from '../subscription/subscription.model';
import stripe from '../../../config/stripe';
import { ISubscription } from '../subscription/subscription.interface';

const createAdminToDB = async (payload: IUser): Promise<IUser> => {
  payload.verified = true;
  const createAdmin: any = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
  }
  return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }
  const isExistAdmin = await User.findByIdAndDelete(id);
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
  }
  return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
  const admins = await User.find({ role: 'ADMIN' }).select("name email role profile").lean();
  return admins;
};

const getUsersFromDB = async (query: Record<string, unknown>): Promise<IUser[]> => {
  const { search, limit, page, status } = query;

  const anyConditions: any[] = [];

  anyConditions.push({
    role: 'USER'
  })

  if (search) {
    anyConditions.push({
      $or: ["name", "company", "website", "linkedIn"].map((field) => ({
        [field]: {
          $regex: search,
          $options: "i"
        }
      }))
    });
  }

  if (status) {
    anyConditions.push({
      status: status
    })
  }


  const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const users = await User.find(whereConditions)
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Subscription.countDocuments(whereConditions);

  const data: any = {
    users,
    meta: {
      page: pages,
      total: count
    }
  }

  return data;
};

const subscriptionDetailsFromDB = async (id: string): Promise<{ subscription: ISubscription | {} }> => {

  const subscription = await Subscription.findOne({ user: id }).populate("package", "title credit").lean();
  if (!subscription) {
    return { subscription: {} }; // Return empty object if no subscription found
  }

  const subscriptionFromStripe = await stripe.subscriptions.retrieve(subscription.subscriptionId);

  // Check subscription status and update database accordingly
  if (subscriptionFromStripe?.status !== "active") {
    await Promise.all([
      User.findByIdAndUpdate(id, { isSubscribed: false }, { new: true }),
      Subscription.findOneAndUpdate({ user: id }, { status: "expired" }, { new: true }),
    ]);
  }

  return { subscription };
};

const blockUserToDB = async (id: string): Promise<IUser | null> => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const subscription = await User.findByIdAndUpdate(
    { _id: id },
    { status: "Block" },
    { new: true }
  )

  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Blocked this user");
  }

  return subscription;
};

const userStatisticFromDB = async (id: string) => {

 

  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('en-US', { month: 'long' }).slice(0, 3),
    user: 0
  }));

  const monthlyEarnings = await Subscription.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        user: { $sum: '$price' },
      },
    }

  ]);

  monthlyEarnings.forEach((income: any) => {
    const monthIndex = income._id.month - 1;
    months[monthIndex].user = income.user;
  });


  return months;
}

const subscriptionStatisticFromDB = async (): Promise<ISubscription> => {

  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  const months: any = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('en-US', { month: 'long' }).slice(0, 3),
    subscription: 0
  }));

  const monthlyEarnings = await Subscription.aggregate([
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        subscription: { $sum: '$price' },
      },
    }

  ]);

  monthlyEarnings.forEach((income: any) => {
    const monthIndex = income._id.month - 1;
    months[monthIndex].subscription = income.subscription;
  });


  return months;

}




export const AdminService = {
  createAdminToDB,
  deleteAdminFromDB,
  getAdminFromDB,
  getUsersFromDB,
  subscriptionDetailsFromDB,
  blockUserToDB,
  userStatisticFromDB,
  subscriptionStatisticFromDB
};

import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import mongoose, { UpdateWriteOpResult } from 'mongoose';
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
  const { search, limit, page, status, subscribe } = query;

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
  
  if (subscribe) {
    anyConditions.push({
      isSubscribed: subscribe
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

  const count = await User.countDocuments(whereConditions);

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

const blockUserToDB = async (id: string): Promise<string> => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
  }

  const isExistUser: IUser | null = await User.findById(id);

  if (isExistUser?.status === "Active") {
    await User.findByIdAndUpdate(
      { _id: id },
      { status: "Block" },
      { new: true }
    )
    return "Blocked This User"
  } else {
    await User.findByIdAndUpdate(
      { _id: id },
      { status: "Active" },
      { new: true }
    )
    return "Active This user"
  }
};

const blockBulkUserToDB = async (ids: string[]): Promise<UpdateWriteOpResult> => {

  const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
  if (!allValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
  }

  const result = await User.updateMany(
    { _id: { $in: ids } },
    { status: "Block" },
    { new: true }
  );
  if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

  return result;
};

const activeBulkUserToDB = async (ids: string[]): Promise<UpdateWriteOpResult> => {

  const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
  if (!allValid) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
  }

  const result = await User.updateMany(
    { _id: { $in: ids } },
    { status: "Active" },
    { new: true }
  );
  if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

  return result;
};

const userStatisticFromDB = async (id: string) => {

  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  // Get the start and end of today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('en-US', { month: 'long' }).slice(0, 3),
    user: 0,
    subscription: 0
  }));

  const monthlyUser = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        user: { $sum: 1 } // This will count the number of users per month
      }
    }
  ]);

  const monthlySubscribeUser = await Subscription.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        subscription: { $sum: 1 } // This will count the number of users per month
      }
    }
  ]);

  monthlyUser.forEach((user: any) => {
    const monthIndex = user._id.month - 1;
    months[monthIndex].user = user.user;
  });

  monthlySubscribeUser.forEach((user: any) => {
    const monthIndex = user._id.month - 1;
    months[monthIndex].subscription = user.subscription;
  });

  const todaySubscribeUser = await Subscription.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart, $lt: todayEnd }
      }
    },
    {
      $group: {
        _id: null,
        subscribeUser: { $sum: 1 } // This will count the number of users per month
      }
    }
  ]);

  const todayUser = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: todayStart, $lt: todayEnd }
      }
    },
    {
      $group: {
        _id: null,
        subscribeUser: { $sum: 1 } // This will count the number of users per month
      }
    }
  ]);

  const totalUser = await User.countDocuments();
  const totalSubscribeUser = await Subscription.countDocuments();


  return {
    months,
    totalSubscribeUser,
    todayUser,
    totalUser,
    todaySubscribeUser
  };
}

const subscriptionStatisticFromDB = async (): Promise<{}> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear + 1, 0, 1);

  // Get the start and end of today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  // Initialize months array with default values
  const months: any = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString('en-US', { month: 'long' }).slice(0, 3),
    subscription: 0,
  }));

  // Aggregate monthly and today's earnings
  const earnings = await Subscription.aggregate([
    // Filter by the current year's date range
    { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
    // Group by month and calculate monthly subscription sum
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        subscription: { $sum: '$price' }, // Monthly subscription earnings
      },
    },
    // Sort by month (optional)
    { $sort: { '_id.month': 1 } },
  ]);

  // Calculate today's income
  const todayIncomeResult = await Subscription.aggregate([
    { $match: { createdAt: { $gte: todayStart, $lt: todayEnd } } },
    {
      $group: {
        _id: null, // We only need the total for today
        todayIncome: { $sum: '$price' },
      },
    },
  ]);

  // Extract today's income
  const todayIncome = todayIncomeResult.length > 0 ? todayIncomeResult[0].todayIncome : 0;

  // Total income across the year
  let totalIncome = 0;

  earnings.forEach((income: any) => {
    const monthIndex = income._id.month - 1;
    months[monthIndex].subscription = income.subscription;
    totalIncome += income.subscription;
  });

  return {
    months,
    totalIncome,
    todayIncome,
  };
};



export const AdminService = {
  createAdminToDB,
  deleteAdminFromDB,
  getAdminFromDB,
  getUsersFromDB,
  subscriptionDetailsFromDB,
  blockUserToDB,
  userStatisticFromDB,
  subscriptionStatisticFromDB,
  blockBulkUserToDB,
  activeBulkUserToDB
};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdminToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin created Successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.params.id;
  const result = await AdminService.deleteAdminFromDB(payload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin Deleted Successfully',
    data: result,
  });
});

const getAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAdminFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin Retrieved Successfully',
    data: result,
  });
});

const getUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Retrieved Successfully',
    data: result
  });
  
});

const userSubscription = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.subscriptionDetailsFromDB(req.params.id );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User  Subscription Retrieved Successfully',
    data: result.subscription
  });

});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.blockUserToDB(req.params.id );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blocked This user Successfully',
    data: result
  });

});

const userStatistic = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.userStatisticFromDB(req.params.id );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User Statistic Retrieved Successfully',
    data: result
  });

});

const subscriptionStatistic = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.subscriptionStatisticFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Subscription Statistic Retrieved Successfully',
    data: result
  });

});

export const AdminController = {
  deleteAdmin,
  createAdmin,
  getAdmin,
  getUser,
  userSubscription,
  blockUser,
  userStatistic,
  subscriptionStatistic
};

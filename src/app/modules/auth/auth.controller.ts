import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { ...verifyData } = req.body;
    const result = await AuthService.verifyEmailToDB(verifyData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: result.message,
        data: result.data,
    });
});


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AuthService.loginUserFromDB(loginData);

    res.cookie('accessToken', result.accessToken, {
        httpOnly: true, // Prevents access via JavaScript
        secure: config.node_env !== 'development', // Ensures the cookie is sent only over HTTPS
        sameSite: 'strict', // Mitigates CSRF attacks
        maxAge: 3600000 // Cookie expiration time in milliseconds (1 hour)
    });

    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true, // Prevents access via JavaScript
        secure: config.node_env !== 'development', // Ensures the cookie is sent only over HTTPS
        sameSite: 'strict', // Mitigates CSRF attacks
        maxAge: 1000 * 60 * 60 * 24 * 30 // Cookie expiration time in milliseconds (1 hour)
    });
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User login successfully',
        data: result
    });
});
  
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const email = req.body.email;
    const result = await AuthService.forgetPasswordToDB(email);
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Please check your email, we send a OTP!',
        data: result
    });
});
  
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const { ...resetData } = req.body;
    const result = await AuthService.resetPasswordToDB(token!, resetData);
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password reset successfully',
        data: result
    });
});
  
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;
    await AuthService.changePasswordToDB(user, passwordData);
  
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Password changed successfully',
    });
});


const newAccessToken = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    const result  = await AuthService.newAccessTokenToUser(refreshToken);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Generate Access Token successfully',
      data: result
    });
  });
  
  const resendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
    const {email} = req.body;
    const result  = await AuthService.resendVerificationEmailToDB(email);
  
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Generate OTP and send successfully',
      data: result
    });
  });
  
export const AuthController = {
    verifyEmail,
    loginUser,
    forgetPassword,
    resetPassword,
    changePassword,
    newAccessToken,
    resendVerificationEmail
};
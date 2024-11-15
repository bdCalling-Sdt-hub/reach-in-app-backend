import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload } from 'jsonwebtoken';
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import unlinkFile from "../../../shared/unlinkFile";

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser | null> => {

    // check email is exist or not
    const isExistEmail = await User.findOne({email: payload.email});
    if(isExistEmail){
        throw new ApiError(StatusCodes.BAD_REQUEST, "This Email Already Taken");
    }

    // check email is exist or not
    const isExistPhone = await User.findOne({contact: payload.contact});
    if(isExistPhone){
        throw new ApiError(StatusCodes.BAD_REQUEST, "This Phone Number Already Taken");
    }

    //set role
    payload.role = USER_ROLES.USER;
    const createUser = await User.create(payload);
    if (!createUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
  
    //send email
    const otp = generateOTP();
    const values = {
        name: createUser.name,
        otp: otp,
        email: createUser.email!
    };

    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);
  
    //save to DB
    const authentication = {
        oneTimeCode: otp,
        expireAt: new Date(Date.now() + 3 * 60000),
    };

    await User.findOneAndUpdate(
        { _id: createUser._id },
        { $set: { authentication } }
    );
  
    return null;
};

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser:any = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
};

const updateProfileToDB = async ( user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { id } = user;
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
  
    //unlink file here
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }
  
    const updateDoc = await User.findOneAndUpdate(
        { _id: id }, 
        payload, 
        { new: true} 
    );
    return updateDoc;
};

export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB
};
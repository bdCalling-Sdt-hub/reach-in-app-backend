import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    name: string;
    role: USER_ROLES;
    contact: string;
    email: string;
    password: string;
    company?: string;
    website?: string;
    linkedIn?: string;
    isSubscribed: boolean;
    profile: string;
    verified: boolean;
    status: "Active" | "Block"
    authentication?: IAuthenticationProps;
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
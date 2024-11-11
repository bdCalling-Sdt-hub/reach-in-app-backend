import { model, Schema } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
import { IUser, UserModal } from "./user.interface";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModal>(
    {
        name: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        contact: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
            select: 0,
            minlength: 8,
        },
        website: {
            type: String,
            required: false,
        },
        linkedIn: {
            type: String,
            required: false,
        },
        isSubscribe: {
            type: String,
            required: false,
        },
        profile: {
            type: String,
            default: 'https://i.ibb.co/z5YHLV9/profile.png',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        authentication: {
            type: {
                isResetPassword: {
                    type: Boolean,
                    default: false,
                },
                oneTimeCode: {
                    type: Number,
                    default: null,
                },
                expireAt: {
                    type: Date,
                    default: null,
                },
            },
            select: 0
        },
        accountInformation: {
            status: {
              type: Boolean
            },
            stripeAccountId: {
                type: String
            },
            externalAccountId: {
                type: String
            },
            currency: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
)


//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
    const isExist = await User.findById(id);
    return isExist;
};
  
userSchema.statics.isExistUserByEmail = async (email: string) => {
    const isExist = await User.findOne({ email });
    return isExist;
};
  
//account check
userSchema.statics.isAccountCreated = async (id: string) => {
    const isUserExist:any = await User.findById(id);
    return isUserExist.accountInformation.status;
};
  
//is match password
userSchema.statics.isMatchPassword = async ( password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
};
  
//check user
userSchema.pre('save', async function (next) {
    const user = this as IUser;

    //check user
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
    }

    // If the role is TEACHER, set accountInformation to default values if not already set
    if (user.role === USER_ROLES.USER) {
        user.accountInformation = {
            status: false
        };
    }
  
    //password hash
    user.password = await bcrypt.hash( user.password, Number(config.bcrypt_salt_rounds));
    next();
});
export const User = model<IUser, UserModal>("User", userSchema)
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICompany } from "./company.interface";
import { Company } from "./company.model";
import mongoose, { FilterQuery } from "mongoose";
import { DeleteResult, UpdateResult } from 'mongodb';
import { Subscription } from "../subscription/subscription.model";
import { Secret } from 'jsonwebtoken';
import { jwtHelper } from "../../../helpers/jwtHelper";
import config from "../../../config";


// create single people to database;
const createCompanyToDB = async (payload: ICompany): Promise<ICompany> => {
    const result = await Company.create(payload);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Company");
    return result;
}

// create bulk people to database
const createBulkCompanyToDB = async (payload: ICompany[]): Promise<ICompany[]> => {
    const createProduct = await Company.insertMany(payload);
    if (!createProduct) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Company");
    return createProduct;
}

// get peoples list from database
const getCompanyFromDB = async (query: Record<string, unknown>): Promise<ICompany[]> => {

    const { search, page, limit, ...othersData } = query;
    const anyConditions: FilterQuery<ICompany>[] = [];

    if (search) {
        anyConditions.push({
            $or: [
                "company_name",
                "industry",
                "country",
            ].map((field) => ({
                [field]: {
                    $regex: search,
                    $options: "i"
                }
            }))
        });
    }


    // Additional filters for other fields
    if (Object.keys(othersData).length) {
        anyConditions.push({
            $and: Object.entries(othersData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }


    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};
    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const companies: ICompany[] = await Company.find(whereConditions)
        .skip(skip)
        .limit(size)
        .lean();

    const count = await Company.countDocuments(whereConditions);

    const data: any = {
        companies,
        meta: {
            page: pages,
            total: count
        }
    }

    return data;
};

const companyDetailsFromDB = async (token: string | null, id: string): Promise<ICompany | null> => {

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");
    }

    // Check if token is provided
    let isExistSubscription = null;

    if (token) {
        const verifyUser = jwtHelper.verifyToken(
            token,
            config.jwt.jwt_secret as Secret
        );

        if (!verifyUser) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
        }else{
            await Subscription.findOneAndUpdate(
                {user: verifyUser.id},
                { $inc: { remaining: -1 } },
                {new: true}
            )
        }

        // Check subscription status
        isExistSubscription = await Subscription.exists({ user: verifyUser.id });
        if (!isExistSubscription) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
        }
    }

    // Fetch Company Details
    const result = await Company.findById(id).lean();
    if (!result) return null;

    // Public mode: Mask sensitive fields
    const maskData = (fields: string[]) =>
        fields.reduce((acc: any, field: any) => {
            acc[field] = "Please subscribe a package";
            return acc;
        }, {} as Partial<ICompany>);

    const protectedFields = [
        "phone",
        "company_type",
        "sales",
        "linkedin",
        "twitter",
        "facebook",
        "decision_hq",
        "corporate_linkage",
        "contact",
        "title",
        "corporate_family",
        "tier",
        "parent",
    ];

    const maskedData = isExistSubscription ? {} : maskData(protectedFields);

    return { ...result, ...maskedData };
};

// update
const updateBulkCompanyToDB = async (payload: { otherPayload: ICompany, ids: string[] }): Promise<UpdateResult> => {

    const { ids, ...otherPayload } = payload;

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await Company.updateMany(
        { _id: { $in: ids } },
        { $set: otherPayload },
        { new: true }
    );
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated Company");

    return result;
};

const updateSingleCompanyToDB = async (id: string, payload: ICompany): Promise<ICompany | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");


    const result = await Company.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated Company");

    return result;
};

const deleteBulkCompanyFromDB = async (ids: string[]): Promise<DeleteResult> => {

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await Company.deleteMany(
        { _id: { $in: ids } }
    )

    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Companys");

    return result;
};

const deleteSingleCompanyFromDB = async (id: string): Promise<ICompany | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Company.findByIdAndDelete(id);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Company");

    return result;
};




export const CompanyService = {
    createBulkCompanyToDB,
    createCompanyToDB,
    getCompanyFromDB,
    updateSingleCompanyToDB,
    updateBulkCompanyToDB,
    deleteSingleCompanyFromDB,
    deleteBulkCompanyFromDB,
    companyDetailsFromDB
}
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPeople } from "./people.interface";
import { People } from "./people.model";
import mongoose, { FilterQuery } from "mongoose";
import { DeleteResult, UpdateResult } from 'mongodb';
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Subscription } from "../subscription/subscription.model";

// create single people to database;
const createPeopleToDB = async (payload: IPeople): Promise<IPeople> => {
    const result = await People.create(payload);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created People");
    return result;
}

// create bulk people to database
const createBulkPeopleToDB = async (payload: IPeople[]): Promise<IPeople[]> => {

    const createProduct = await People.insertMany(payload);
    if (!createProduct) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created People");
    return createProduct;
}

// get peoples list from database
const getPeopleFromDB = async (query: Record<string, unknown>): Promise<IPeople[]> => {

    const anyConditions: FilterQuery<IPeople>[] = [];

    const { page, limit, accuracy_score, search, ...filterData } = query;

    //service search here
    if (search) {
        anyConditions.push({
            $or: [
                "company_name", "first_name", "last_name", "city", "state",
                "zip_code", "company_country", "company_city",
                "company_state", "company_zip_Code"
            ]
                .map((field) => ({
                    [field]: {
                        $regex: search,
                        $options: "i"
                    }
                }))
        });
    }

    // Accuracy score range filtering
    if (accuracy_score) {
        const maxScore = parseFloat(accuracy_score as string);
        if (!isNaN(maxScore)) {
            anyConditions.push({
                accuracy_score: { $gte: 0, $lte: maxScore }
            });
        }
    }

    // Additional filters for other fields
    if (Object.keys(filterData).length) {
        anyConditions.push({
            $and: Object.entries(filterData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }

    // Apply filter conditions
    const whereConditions = anyConditions.length > 0 ? { $and: anyConditions } : {};

    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const result = await People.find(whereConditions).skip(skip).limit(size).lean();
    const total = await People.countDocuments(whereConditions);

    const data: any = {
        peoples: result,
        meta: {
            page: pages,
            total
        }
    }
    return data;
};

const peopleDetailsFromDB = async (user: JwtPayload, id: string): Promise<IPeople | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const isExistUser = await User.findById(user.id).select("role isSubscribed").lean();

    if (isExistUser?.role === "USER" && isExistUser.isSubscribed === false) {
        throw new ApiError(StatusCodes.FORBIDDEN, "To get Access you need to subscribe a subscription");
    }

    const isExistSubscription:any = await Subscription.findOne({user: user.id}).lean();

    if(isExistUser?.role === "USER" && isExistUser.isSubscribed === true && isExistSubscription?.remaining > 0){
        await Subscription.findOneAndUpdate(
            {user: user.id},
            { $inc: { remaining: -1 } },
            {new: true}
        )
    }

    const result = await People.findById(id);
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Person not found.");
    }

    return result;
};

// update
const updateBulkPeopleToDB = async (payload: { otherPayload: IPeople, ids: string[] }): Promise<UpdateResult> => {

    const { ids, ...otherPayload } = payload;

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await People.updateMany(
        { _id: { $in: ids } },
        { $set: otherPayload },
        { new: true }
    );
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

    return result;
};

const updateSinglePeopleToDB = async (id: string, payload: IPeople): Promise<IPeople | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await People.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    );
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

    return result;
};

const deleteBulkPeopleFromDB = async (ids: string[]): Promise<DeleteResult> => {

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await People.deleteMany(
        { _id: { $in: ids } }
    )

    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Peoples");

    return result;
};

const deleteSinglePeopleFromDB = async (id: string): Promise<IPeople | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await People.findByIdAndDelete(id);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete People");

    return result;
};




export const PeopleService = {
    createBulkPeopleToDB,
    createPeopleToDB,
    getPeopleFromDB,
    updateSinglePeopleToDB,
    updateBulkPeopleToDB,
    deleteSinglePeopleFromDB,
    deleteBulkPeopleFromDB,
    peopleDetailsFromDB
}
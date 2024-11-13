import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IPeople } from "./people.interface";
import { People } from "./people.model";
import mongoose from "mongoose";
import { DeleteResult, UpdateResult } from 'mongodb';

// create single people to database;
const createPeopleToDB = async(payload: IPeople): Promise<IPeople>=>{
    const result = await People.create(payload);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created People");
    return result;
}

// create bulk people to database
const createBulkPeopleToDB = async(payload: IPeople[]): Promise<IPeople[]>=>{
    const createProduct = await People.insertMany(payload);
    if(!createProduct) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created People");
    return createProduct;
}

// get peoples list from database
const getPeopleFromDB = async(): Promise<IPeople[]>=>{
    const result = await People.find({});
    return result;
};

// update
const updateBulkPeopleToDB = async(payload: {otherPayload: IPeople, ids: string[]} ): Promise<UpdateResult>=>{

    const {ids, ...otherPayload}= payload;

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await People.updateMany(
        { _id: { $in: ids } },
        { $set: otherPayload },
        {new: true}
    );
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

    return result;
};

const updateSinglePeopleToDB = async(id: string, payload:IPeople): Promise<IPeople | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");


    const result = await People.findById(
        {_id: id},
        payload,
        {new: true}
    );
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated People");

    return result;
};

const deleteBulkPeopleFromDB = async(ids: string[]): Promise<DeleteResult>=>{

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }
    
    const result = await People.deleteMany(
        { _id: { $in: ids } }
    )

    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Peoples");

    return result;
};

const deleteSinglePeopleFromDB = async(id: string): Promise<IPeople | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await People.findByIdAndDelete(id);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete People");

    return result;
};




export const PeopleService = {
    createBulkPeopleToDB,
    createPeopleToDB,
    getPeopleFromDB,
    updateSinglePeopleToDB,
    updateBulkPeopleToDB,
    deleteSinglePeopleFromDB,
    deleteBulkPeopleFromDB
}
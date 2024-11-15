import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { ICompany } from "./company.interface";
import { Company } from "./company.model";
import mongoose from "mongoose";
import { DeleteResult, UpdateResult } from 'mongodb';

// create single people to database;
const createCompanyToDB = async(payload: ICompany): Promise<ICompany>=>{
    const result = await Company.create(payload);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Company");
    return result;
}

// create bulk people to database
const createBulkCompanyToDB = async(payload: ICompany[]): Promise<ICompany[]>=>{
    const createProduct = await Company.insertMany(payload);
    if(!createProduct) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Company");
    return createProduct;
}

// get peoples list from database
const getCompanyFromDB = async(): Promise<ICompany[]>=>{
    const result = await Company.find({});
    return result;
};

// update
const updateBulkCompanyToDB = async(payload: {otherPayload: ICompany, ids: string[]} ): Promise<UpdateResult>=>{

    const {ids, ...otherPayload}= payload;

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }

    const result = await Company.updateMany(
        { _id: { $in: ids } },
        { $set: otherPayload },
        {new: true}
    );
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated Company");

    return result;
};

const updateSingleCompanyToDB = async(id: string, payload:ICompany): Promise<ICompany | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");


    const result = await Company.findById(
        {_id: id},
        payload,
        {new: true}
    );
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Updated Company");

    return result;
};

const deleteBulkCompanyFromDB = async(ids: string[]): Promise<DeleteResult>=>{

    const allValid = ids.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!allValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "One or more IDs are invalid");
    }
    
    const result = await Company.deleteMany(
        { _id: { $in: ids } }
    )

    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Companys");

    return result;
};

const deleteSingleCompanyFromDB = async(id: string): Promise<ICompany | null>=>{

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Company.findByIdAndDelete(id);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Delete Company");

    return result;
};




export const CompanyService = {
    createBulkCompanyToDB,
    createCompanyToDB,
    getCompanyFromDB,
    updateSingleCompanyToDB,
    updateBulkCompanyToDB,
    deleteSingleCompanyFromDB,
    deleteBulkCompanyFromDB
}
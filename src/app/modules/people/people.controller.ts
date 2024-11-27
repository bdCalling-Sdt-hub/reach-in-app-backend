import { Response, Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PeopleService } from "./people.service";


const createPeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.createPeopleToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk People Created Successfully", 
        data: result
    })
});

const createBulkPeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.createBulkPeopleToDB(req.body?.people);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "People Created Successfully", 
        data: result
    })
});

const getPeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.getPeopleFromDB(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "People Retrieved Successfully", 
        data: result
    })
});

const peopleDetails = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.peopleDetailsFromDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "People Retrieved Successfully", 
        data: result
    })
});

// update bulk people information
const updateBulkPeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.updateBulkPeopleToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk People Updated Successfully", 
        data: result
    })
});

// update people information
const updateSinglePeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.updateSinglePeopleToDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "People Updated Successfully",
        data: result 
    })
});

// delete people
const deleteSinglePeople = catchAsync(async(req:Request, res: Response)=>{

    const result = await PeopleService.deleteSinglePeopleFromDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "People Deleted Successfully", 
        data: result
    })
});

// delete people
const deleteBulkPeople = catchAsync(async(req:Request, res: Response)=>{
    const result = await PeopleService.deleteBulkPeopleFromDB(req.body.ids);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk People Deleted  Successfully", 
        data: result
    })
});

export const PeopleController = {
    createBulkPeople,
    createPeople,
    getPeople,
    updateBulkPeople,
    updateSinglePeople,
    deleteSinglePeople,
    deleteBulkPeople,
    peopleDetails
}
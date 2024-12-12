import { Response, Request } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CompanyService } from "./company.service";


const createCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.createCompanyToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk Company Created Successfully", 
        data: result
    })
});

const createBulkCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.createBulkCompanyToDB(req.body.people);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Company Created Successfully", 
        data: result
    })
});

const getCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.getCompanyFromDB(req.query);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Company Retrieved Successfully", 
        data: result
    })
});

const companyDetails = catchAsync(async(req:Request, res: Response)=>{
    const token = req.headers.authorization;
    const result = await CompanyService.companyDetailsFromDB(token!, req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Company Retrieved Successfully", 
        data: result
    })
});

// update bulk people information
const updateBulkCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.updateBulkCompanyToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk Company Updated Successfully", 
        data: result
    })
});

// update people information
const updateSingleCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.updateSingleCompanyToDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Company Updated Successfully",
        data: result 
    })
});

// delete people
const deleteSingleCompany = catchAsync(async(req:Request, res: Response)=>{

    const result = await CompanyService.deleteSingleCompanyFromDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Company Deleted Successfully", 
        data: result
    })
});

// delete people
const deleteBulkCompany = catchAsync(async(req:Request, res: Response)=>{
    const result = await CompanyService.deleteBulkCompanyFromDB(req.body.ids);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Bulk Company Deleted  Successfully", 
        data: result
    })
});

export const CompanyController = {
    createBulkCompany,
    createCompany,
    getCompany,
    updateBulkCompany,
    updateSingleCompany,
    deleteSingleCompany,
    deleteBulkCompany,
    companyDetails
}
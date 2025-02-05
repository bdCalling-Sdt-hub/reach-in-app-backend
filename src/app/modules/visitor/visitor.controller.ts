import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { VisitorService } from "./visitor.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const visitorList = catchAsync(async(req: Request, res: Response)=>{
    const result = await VisitorService.visitorListFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Visitor Data retrieved successfully",
        data: result
    })
})



export const VisitorController = { visitorList };
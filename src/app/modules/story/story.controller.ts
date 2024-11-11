import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { StoryService } from "./story.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createStory = catchAsync(async (req: Request, res: Response) => {
    const result = await StoryService.createStoryToDB(req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Story created Successfully",
        data: result
    })
});

const updateStory = catchAsync(async (req: Request, res: Response) => {
    const result = await StoryService.updateStoryToDB(req.params.id, req.body);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Story updated Successfully",
        data: result
    })
});

const getStory = catchAsync(async (req: Request, res: Response) => {
    const result = await StoryService.getStoryFromDB();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Story Retrieved Successfully",
        data: result
    })
});


const deleteStory = catchAsync(async (req: Request, res: Response) => {
    const result = await StoryService.deleteStoryToDB(req.params.id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Story Deleted Successfully",
        data: result
    })
});

export const StoryController = {
    createStory,
    updateStory,
    getStory,
    deleteStory
}
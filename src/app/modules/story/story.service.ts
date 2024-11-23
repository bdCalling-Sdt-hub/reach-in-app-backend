import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IStory } from "./story.interface"
import { Story } from "./story.model";
import mongoose from "mongoose";


const createStoryToDB = async (payload: IStory): Promise<IStory> => {

    const result = await Story.create(payload);
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Story")
    return result;
}

const getStoryFromDB = async (query: Record<string, unknown>): Promise<IStory[]> => {
    const { page, limit } = query;

    const pages = parseInt(page as string) || 1;
    const size = parseInt(limit as string) || 10;
    const skip = (pages - 1) * size;

    const story = await Story.find({})
        .select("subject year answer image")
        .skip(skip)
        .limit(size);

    const count = await Story.countDocuments();

    const data: any = {
        story,
        meta: {
            page: pages,
            total: count
        }
    }
    return data;
}

const updateStoryToDB = async (id: string, payload: IStory): Promise<IStory | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Story.findByIdAndUpdate(
        { _id: id },
        payload,
        { new: true }
    )

    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To Updated Story");

    return result
}

const deleteStoryToDB = async (id: string): Promise<IStory | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Story.findByIdAndDelete(id)
    if (!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To Deleted Story");

    return result
}

const storyDetailsFromDB = async (id: string): Promise<IStory | null> => {

    if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Story.findById(id);
    return result
}

export const StoryService = {
    createStoryToDB,
    getStoryFromDB,
    updateStoryToDB,
    deleteStoryToDB,
    storyDetailsFromDB
}
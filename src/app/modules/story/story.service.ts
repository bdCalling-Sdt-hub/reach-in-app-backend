import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IStory } from "./story.interface"
import { Story } from "./story.model";
import mongoose from "mongoose";


const createStoryToDB = async (payload: IStory): Promise<IStory> => {

    const result = await Story.create(payload);
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to created Story")
    return result;
}
  
const getStoryFromDB = async (): Promise<IStory[]> => {
    const result = await Story.find().select("subject year details").select("subject year answer");
    return result
}

const updateStoryToDB = async (id: string, payload: IStory): Promise<IStory  | null> => {

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Story.findByIdAndUpdate(
        {_id: id},
        payload,
        {new : true}
    )

    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To Updated Story");

    return result
}

const deleteStoryToDB = async (id: string): Promise<IStory  | null> => {

    if(!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ID");

    const result = await Story.findByIdAndDelete(id)
    if(!result) throw new ApiError(StatusCodes.BAD_REQUEST, "Failed To Deleted Story");

    return result
}

export const StoryService = {
    createStoryToDB,
    getStoryFromDB,
    updateStoryToDB,
    deleteStoryToDB
}
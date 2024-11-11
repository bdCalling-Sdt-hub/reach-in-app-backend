import { model, Schema } from 'mongoose';
import { IStory, StoryModel } from './story.interface';

const storySchema = new Schema<IStory, StoryModel>(
    {
        subject: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

export const Story = model<IStory, StoryModel>('Story', storySchema);

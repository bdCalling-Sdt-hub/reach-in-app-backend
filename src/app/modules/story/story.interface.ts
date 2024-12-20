import { Model } from 'mongoose'

export type IStory = {
  subject: string
  year: number;
  answer: string;
  image: string;
}

export type StoryModel = Model<IStory, Record<string, unknown>>

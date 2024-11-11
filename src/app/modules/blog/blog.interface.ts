import { Model } from 'mongoose';

export enum Category {
    Privacy = "Privacy/Data",
    Marketing = "Marketing Operation",
    Sales = "Sales Operation",
    HR = "HR",
}

export type IBlog = {
    subject: string;
    image: string;
    category: Category;
    url: string;
    details: string;
};
export type BlogModel = Model<IBlog, Record<string, unknown>>;
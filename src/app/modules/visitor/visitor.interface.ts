import { Model } from "mongoose";

export type IVisitor = {
    _id?:string;
    ip: string;
}

export type VisitorModel = Model<IVisitor, Record<string, any>>;
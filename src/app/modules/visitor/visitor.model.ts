import { Schema, model } from "mongoose";
import { IVisitor, VisitorModel } from "./visitor.interface";

const visitorSchema = new Schema<IVisitor>(
    {
        ip: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export const Visitor: VisitorModel = model<IVisitor, VisitorModel>('Visitor', visitorSchema);
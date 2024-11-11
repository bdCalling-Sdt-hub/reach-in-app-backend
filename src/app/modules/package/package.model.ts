import { model, Schema } from "mongoose";
import { IPackage, PackageModel } from "./package.interface";

const packageSchema = new Schema<IPackage, PackageModel>(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: String,
            enum: ["month", "year"],
            required: true
        },
        category: {
            type: String,
            category: ['Monthly', 'Yearly'],
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        credit: {
            type: Number,
            required: true
        },
        paymentLink: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Package = model<IPackage, PackageModel>("Package", packageSchema)
import { model, Schema } from "mongoose";
import { IBlog, BlogModel, Category } from "./blog.interface"

const blogSchema = new Schema<IBlog, BlogModel>(
    {
        subject: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: Object.values(Category),
            required: true
        },
        url: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)
export const Blog = model<IBlog, BlogModel>("Blog", blogSchema);
import { z } from 'zod';
import { Category } from './blog.interface';

const createBlogZodSchema = z.object({
    body: z.object({
        subject: z.string({required_error: "Question is required"}),
        image: z.string({required_error :"Image is required"}),
        category: z.nativeEnum(Category, { required_error: "Category is required" }),
        url: z.string(({required_error :"URL is required"})),
        details: z.string(({required_error :"Description is required"}))
    })
});

export const BlogValidation = {
    createBlogZodSchema
};
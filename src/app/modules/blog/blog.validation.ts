import { z } from 'zod';
import { Category } from './blog.interface';

const createBlogZodSchema = z.object({
    body: z.object({
        subject: z.string().min(1, { message: 'Question is required' }),
        image: z.string().min(1, { message: 'Image is required' }),
        category: z.enum([Category.Privacy, Category.Sales, Category.Marketing, Category.HR]),
        url: z.string().min(1, {message: "Url is required"}),
        details: z.string().min(1, {message: "Details is required"}),
    })
});

export const BlogValidation = {
    createBlogZodSchema
};
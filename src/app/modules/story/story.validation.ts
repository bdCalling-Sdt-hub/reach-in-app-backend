import { z } from 'zod'

const createStoryZodSchema = z.object({
    body: z.object({
        subject: z.string({ required_error: 'Subject is required' }),
        year: z
            .union([z.string(), z.number()])
            .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
            .refine((val) => !isNaN(val), { message: "Year must be a valid number." }),
        answer: z.string({ required_error: 'Answer is required' }),
        image: z.string({ required_error: 'Image is required' })
    })
});

export const StoryValidation = {
    createStoryZodSchema
}
import { z } from 'zod'

const createStoryZodSchema = z.object({
    body: z.object({
        subject: z.string({ required_error: 'Subject is required' }),
        year: z.number({ required_error: 'Year is required' }),
        answer: z.string({ required_error: 'Answer is required' }),
        image: z.string({ required_error: 'Image is required' })
    })
});

export const StoryValidation = {
    createStoryZodSchema
}
import { z } from 'zod'

const createPackageZodSchema = z.object({
    body: z.object({
        title: z.string({required_error: "Title is required"}),
        description: z.string({required_error: "Description is required"}),
        price: z.number({required_error: "Number is required"}),
        duration: z.enum(["month", "year"], {required_error: "Duration is required"}),
        paymentLink: z.string({required_error: "Feature is required"}),
        productId: z.string({required_error: "Product ID is required"}),
        credit: z.number({required_error: "Credit is required"}),
    })
})

export const PackageValidation = {
    createPackageZodSchema
}
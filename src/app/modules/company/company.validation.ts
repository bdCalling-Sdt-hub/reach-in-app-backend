import { z } from "zod";

// Define the Zod validation schema for ICompany with custom error messages
const createCompanyZodSchema = z.object({
    personal: z.object({
        contact_name: z.string({ required_error: "Contact name is required" }),
        title: z.string({ required_error: "Title is required" }),
        address: z.string({ required_error: "Address is required" }),
        email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
        hq_phone: z.string({ required_error: "HQ Phone is required" }),
        line: z.string({ required_error: "Line is required" }),
        mobile_number: z.string({ required_error: "Mobile Number is required" }),
        website: z.string({ required_error: "Website is required" }).url("Invalid website URL"),
    }),
    details: z.object({
        company_name: z.string({ required_error: "Company name is required" }),
        industry: z.string({ required_error: "Industry is required" }),
        total_employee: z.number({ required_error: "Total employee is required" })
            .int("Total employee must be an integer")
            .min(1, "Total employee must be a positive integer"),
        estimate_revenue: z.string({ required_error: "Estimate Revenue is required" }),
        location: z.string({ required_error: "Location is required" }),
        hq_location: z.string({ required_error: "HQ Location is required" }),
        overview: z.string({ required_error: "Overview is required" })
    }),
    management: z.object({
        open_contact: z.string({ required_error: "Open Contact is required" }),
        non_monger: z.string({ required_error: "Non Monger is required" }),
        monger: z.string({ required_error: "Monger is required" }),
        director_count: z.number({ required_error: "Director count is required" })
            .int("Director count must be an integer")
            .min(0, "Director count must be a non-negative integer"),
        c_level: z.boolean({ required_error: "C-level status is required" }),
    }),
    contact: z.object({
        instagram: z.string({ required_error: "Instagram Link is required" }).url("Invalid Instagram URL"),
        facebook: z.string({ required_error: "Facebook Link is required" }).url("Invalid Facebook URL"),
        twitter: z.string({ required_error: "Twitter Link is required" }).url("Invalid Twitter URL"),
        linkedin_profile: z.string({ required_error: "Linkedin Link is required" }).url("Invalid LinkedIn URL"),
        youtube_channel: z.string({ required_error: "Youtube Channel Link is required" }).url("Invalid YouTube URL")
    })
});


const updateCompanyZodSchema = z.object({
    personal: z.object({
        contact_name: z.string().optional(),
        title: z.string().optional(),
        address: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        hq_phone: z.string().optional(),
        line: z.string().optional(),
        mobile_number: z.string().optional(),
        website: z.string().url("Invalid website URL").optional(),
    }).optional(),
    details: z.object({
        company_name: z.string().optional(),
        industry: z.string().optional(),
        total_employee: z.number().int("Total employee must be an integer")
            .min(1, "Total employee must be a positive integer").optional(),
        estimate_revenue: z.string().optional(),
        location: z.string().optional(),
        hq_location: z.string().optional(),
        overview: z.string().optional()
    }).optional(),
    management: z.object({
        open_contact: z.string().optional(),
        non_monger: z.string().optional(),
        monger: z.string().optional(),
        director_count: z.number().int("Director count must be an integer")
            .min(0, "Director count must be a non-negative integer").optional(),
        c_level: z.boolean().optional(),
    }).optional(),
    contact: z.object({
        instagram: z.string().url("Invalid Instagram URL").optional(),
        facebook: z.string().url("Invalid Facebook URL").optional(),
        twitter: z.string().url("Invalid Twitter URL").optional(),
        linkedin_profile: z.string().url("Invalid LinkedIn URL").optional(),
        youtube_channel: z.string().url("Invalid YouTube URL").optional()
    }).optional()
});


export const CompanyValidation = { 
    createCompanyZodSchema,
    updateCompanyZodSchema 
};
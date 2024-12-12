import { z } from "zod";

// Define the Zod schema for IPeople
const createZodPeopleSchema = z.object({
    body: z.object({
        zoom_contact_info: z.string().optional(),
        company_name: z.string({required_error: "Company Name Required"} ),
        first_name: z.string({required_error: "First Name"}),
        last_name: z.string({required_error: "last Name"}),
        salutation: z.string().optional(),
        suffix: z.string().optional(),
        middle_name: z.string().optional(),
        title: z.string().optional(),
        email: z.string({required_error: "Email is required"}).email(),
        function: z.string().optional(),
        seniority: z.string().optional(),
        phone: z.string({required_error: "Phone Number is Required"}),
        mobile: z.string().optional(),
        hq_phone: z.string().optional(),
        linkedin: z.string().url().optional(),
        country: z.string({required_error: "Country is required"}),
        city: z.string({required_error: "City is required"}),
        state: z.string({required_error: "State is Required"}),
        zip_code: z.string({required_error: "Zip Code is Required"}), // check yet 
        zoom_company_id: z.string().optional(),
        attribute1: z.string().optional(),
        attribute2: z.string().optional(),
        supplement_email: z.string().email().optional(),
        industry: z.string().optional(),
        sub_industry: z.string().optional(),
        employee_count: z.string().optional(),
        source: z.string().optional(),
        accuracy_score: z
            .union([z.number(), z.string().transform((val) => parseFloat(val))])
            .optional(),
        zoom_info_contact: z.string().optional(),
        website: z.string().url().optional(),
        revenue: z.string().optional(),
        revenue_range: z.string().optional(),
        zoom_info_company_profile: z.string().optional(),
        company_linkedin: z.string().url().optional(),
        company_facebook: z.string().url().optional(),
        company_twitter: z.string().url().optional(),
        ownership: z.string().optional(),
        business_model: z.string().optional(),
        company_country: z.string().optional(),
        company_city: z.string().optional(),
        company_state: z.string().optional(),
        company_zip_Code: z.string().optional(),
        image: z.string().url().optional(),
        hq_location: z.string().optional(),
        company_overview: z.string().optional(),
        open_contact: z.string().optional(),
        non_manager: z.string().optional(),
        manager: z.string().optional(),
        director: z.string().optional(),
        c_level: z.string().optional()
    })
});

export const PeopleValidation = {
    createZodPeopleSchema
}

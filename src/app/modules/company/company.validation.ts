import { z } from "zod";

// Define the Zod validation schema for ICompany with custom error messages
const createCompanyZodSchema = z.object({
    body: z.object({
        company_name: z.string().optional(),
        company_link: z.string().optional(),
        phone: z.string().optional(),
        company_type: z.string().optional(),
        employee_total: z.string().optional(),
        employees: z.string().optional(),
        sales: z.string().optional(),
        district: z.string().optional(),
        industry: z.string().optional(),
        dunsNumber: z.string().optional(),
        country: z.string().optional(),
        trade: z.string().optional(),
        linkedin: z.string().optional(),
        twitter: z.string().optional(),
        facebook: z.string().optional(),
        address: z.string().optional(),
        headquarters: z.string().optional(),
        decision_hq: z.string().optional(),
        corporate_linkage: z.string().optional(),
        business_description: z.string().optional(),
        contact: z.string().optional(),
        title: z.string().optional(),
        company_for_contact: z.string().optional(),
        corporate_family: z.string().optional(),
        tier: z.string().optional(),
        parent: z.string().optional(),
        corporate_company_name: z.string().optional(),
        corporate_decision_hq: z.string().optional(),
        corporate_headquarters: z.string().optional(),
        corporate_subsidary: z.string().optional(),
        corporate_branch: z.string().optional(),
        corporate_is_decision_hq: z.string().optional(),
        corporate_is_headquarter: z.string().optional(),
        corporate_ownership_type: z.string().optional(),
        corporate_entity_type: z.string().optional(),
        corporate_city: z.string().optional(),
        corporate_state: z.string().optional(),
        corporate_country: z.string().optional(),
        employees_single: z.string().optional(),
        corporate_sales: z.string().optional(),
        corporate_hoovers_industry: z.string().optional(),
        corporate_key_id: z.string().optional(),
        corporate_duns_number: z.string().optional(),
        corporate_hoovers_contacts: z.string().optional(),
        corporate_direct_marketing_status: z.string().optional(),
        total_non_manager: z.number().optional(),
        total_manager: z.number().optional(),
        total_c_level: z.number().optional(),
        total_open_contact: z.number().optional(),
    })
});


export const CompanyValidation = {
    createCompanyZodSchema
};
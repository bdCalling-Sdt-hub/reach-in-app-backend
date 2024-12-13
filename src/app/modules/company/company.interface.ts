import { Model } from "mongoose";

export type ICompany = {
    company_name?: string;
    company_link?: string;
    phone?: string;
    company_type?: string;
    employee_total?: string;
    employees?: string;
    sales?: string;
    district?: string;
    industry?: string;
    dunsNumber?: string;
    country?: string;
    trade?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    address?: string;
    headquarters?: string;
    decision_hq?: string;
    corporate_linkage?: string;
    business_description?: string;
    contact?: string;
    title?: string;
    company_for_contact?: string;
    corporate_family?: string;
    tier?: string;
    parent?: string;
    corporate_company_name?: string;
    corporate_decision_hq?: string;
    corporate_headquarters?: string;
    corporate_subsidary?: string;
    corporate_branch?: string;
    corporate_is_decision_hq?: string;
    corporate_is_headquarter?: string;
    corporate_ownership_type?: string;
    corporate_entity_type?: string;
    corporate_city?: string;
    corporate_state?: string;
    corporate_country?: string;
    employees_single?: string;
    corporate_sales?: string;
    corporate_hoovers_industry?: string;
    corporate_key_id?: string;
    corporate_duns_number?: string;
    corporate_hoovers_contacts?: string;
    corporate_direct_marketing_status?: string;
    image?: string;
    total_non_manager?: number;
    total_manager?: number;
    total_c_level?: number;
    total_open_contact?: number;
}

// Define the CompanyModel type with generics for a cleaner Mongoose model definition
export type CompanyModel = Model<ICompany, Record<string, unknown>>;
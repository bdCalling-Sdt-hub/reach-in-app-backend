import { Model } from "mongoose";

export type IPeople = {
    zoom_contact_info?: string;
    company_name: string;
    first_name: string;
    last_name: string;
    salutation?: string;
    suffix?: string;
    middle_name?: string;
    title?: string;
    email: string;
    function: string;
    seniority?: string;
    phone: string;
    mobile?: string;
    hq_phone?: string;
    linkedin: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    zoom_company_id?: string;
    attribute1?: string;
    attribute2?: string;
    supplement_email?: string;
    industry?: string;
    sub_industry?: string;
    employee_count?: string;
    source?: string;
    accuracy_score?: number;
    zoom_info_contact?: string;
    website?: string;
    revenue?: string;
    revenue_range?: string;
    zoom_info_company_profile?: string;
    company_linkedin?: string;
    company_facebook?: string;
    company_twitter?: string;
    ownership?: string;
    business_model?: string;
    company_country?: string;
    company_city?: string;
    company_state?: string;
    company_zip_Code?: string;
    image?: string;
    hq_location?: string;
    company_overview: string;
    open_contact: string;
    non_manager: string;
    manager: string;
    director: string;
    c_level: string;
}

// Define the PeopleModel type with generics for a cleaner Mongoose model definition
export type PeopleModel = Model<IPeople, Record<string, unknown>>;
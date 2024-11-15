import { Model } from "mongoose";

export type ICompany = {
    company: {
        name: string;
        industry: string;
        company_type: string;
        company_name: string;
        total_employee: number;
        estimate_revenue?: string;
        location: string;
        hq_location?: string;
        overview?: string;
    };
    contact: {
        instagram: string;
        facebook: string;
        twitter: string;
        linkedin_profile: string;
        youtube_channel: string;
    };
    management: {
        open_contact?: string;
        non_monger?: string;
        monger?: string;
        director_count: number;
        c_level: boolean;
    }
    
}

// Define the CompanyModel type with generics for a cleaner Mongoose model definition
export type CompanyModel = Model<ICompany, Record<string, unknown>>;
import { Model } from "mongoose";

export type IPeople = {
    personal: {
        contact_name: string;
        title: string;
        address: string;
        email: string;
        hq_phone?: string;
        line?: string;
        mobile_number?: string;
        website?: string;
    };
    details: {
        company_name: string;
        industry: string;
        total_employee: number;
        estimate_revenue?: string;
        location: string;
        hq_location?: string;
        overview?: string;
    };
    management: {
        open_contact?: string;
        non_monger?: string;
        monger?: string;
        director_count: number;
        c_level: boolean;
    };
    contact: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        linkedin_profile?: string;
        youtube_channel?: string;
    };
}

// Define the PeopleModel type with generics for a cleaner Mongoose model definition
export type PeopleModel = Model<IPeople, Record<string, unknown>>;
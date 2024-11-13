import { Schema, model } from "mongoose";
import { IPeople, PeopleModel } from "./people.interface";

const PeopleSchema = new Schema<IPeople, PeopleModel>(
    {
        personal: {
            contact_name: { type: String, required: true },
            title: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String, required: true },
            hq_phone: { type: String, default: null },
            line: { type: String, default: null },
            mobile_number: { type: String, default: null },
            website: { type: String, default: null },
        },
        details: {
            company_name: { type: String, required: true },
            industry: { type: String, required: true },
            total_employee: { type: Number, required: true },
            estimate_revenue: { type: String, default: null },
            location: { type: String, required: true },
            hq_location: { type: String, default: null },
            overview: { type: String, default: null },
        },
        management: {
            open_contact: { type: String, default: null },
            non_monger: { type: String, default: null },
            monger: { type: String, default: null },
            director_count: { type: Number, required: true },
            c_level: { type: Boolean, required: true },
        },
        contact: {
            instagram: { type: String, default: null },
            facebook: { type: String, default: null },
            twitter: { type: String, default: null },
            linkedin_profile: { type: String, default: null },
            youtube_channel: { type: String, default: null },
        },
    },
    {
        timestamps: true
    }

);

// Create the Mongoose model for the IPeople interface
export const People = model<IPeople, PeopleModel>("People", PeopleSchema);

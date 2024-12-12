import { Schema, model } from "mongoose";
import { IPeople, PeopleModel } from "./people.interface";

// Define the schema for the IPeople interface
const PeopleSchema = new Schema<IPeople, PeopleModel>(
    {
        zoom_contact_info: { type: String, required: false },
        company_name: { type: String, required: false },
        first_name: { type: String, required: false },
        last_name: { type: String, required: false },
        salutation: { type: String, required: false },
        suffix: { type: String, required: false },
        middle_name: { type: String, required: false },
        title: { type: String, required: false },
        email: { type: String, required: false },
        function: { type: String, required: false },
        seniority: { type: String, required: false },
        phone: { type: String, required: false },
        mobile: { type: String, required: false },
        hq_phone: { type: String, required: false },
        linkedin: { type: String, required: false },
        country: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zip_code: { type: String, required: false },
        zoom_company_id: { type: String, required: false },
        attribute1: { type: String, required: false },
        attribute2: { type: String, required: false },
        supplement_email: { type: String, required: false },
        industry: { type: String, required: false },
        sub_industry: { type: String, required: false },
        employee_count: { type: String, required: false },
        source: { type: String, required: false },
        accuracy_score: { type: Number, required: false },
        zoom_info_contact: { type: String, required: false },
        website: { type: String, required: false },
        revenue: { type: String, required: false },
        revenue_range: { type: String, required: false },
        zoom_info_company_profile: { type: String, required: false },
        company_linkedin: { type: String, required: false },
        company_facebook: { type: String, required: false },
        company_twitter: { type: String, required: false },
        ownership: { type: String, required: false },
        business_model: { type: String, required: false },
        company_country: { type: String, required: false },
        company_city: { type: String, required: false },
        company_state: { type: String, required: false },
        company_zip_Code: { type: String, required: false },
        image: {
            type: String,
            default: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        },
        hq_location: { type: String, required: false },
        company_overview: { type: String, required: false },
        open_contact: { type: String, required: false },
        non_manager: { type: String, required: false },
        manager: { type: String, required: false },
        director: { type: String, required: false },
        c_level: { type: String, required: false },
    },
    {
        timestamps: true,
    }
);

// Create and export the Mongoose model
export const People = model<IPeople, PeopleModel>("People", PeopleSchema);
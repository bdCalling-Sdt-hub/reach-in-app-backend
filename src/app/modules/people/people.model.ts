import { Schema, model } from "mongoose";// Adjust the path accordingly
import { IPeople, PeopleModel } from "./people.interface";

// Define the schema for IPeople
const PeopleSchema = new Schema<IPeople, PeopleModel>(
    {
        name: { type: String, required: true },
        location: { type: String, required: true },
        hqLocation: { type: String, required: true },
        designation: { type: String, required: true },
        companyName: { type: String, required: true },
        instagram: { type: String, required: false },
        facebook: { type: String, required: false },
        twitter: { type: String, required: false },
        linkedin: { type: String, required: false },
        youtube: { type: String, required: false },
        totalEmployee: { type: String, required: true },
        revenue: { type: String, required: true },
        industry: { type: String, required: true },
        hqPhone: { type: String, required: false },
        lineNumber: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        overview: { type: String, required: false },
        image: { 
            type: String, 
            default: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png"
        },
        openContact: { type: String, required: false },
        nonManager: { type: String, required: false },
        manager: { type: String, required: false },
        directorCount: { type: String, required: true },
        cLevel: { type: String, required: true },
        website: { type: String, required: true }
    },
    { timestamps: true }
);

// Create the model
export const People = model<IPeople, PeopleModel>("People", PeopleSchema);

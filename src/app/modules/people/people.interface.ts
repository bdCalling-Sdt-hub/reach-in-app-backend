import { Model } from "mongoose";

export type IPeople = {
    name: string;
    location: string;
    hqLocation: string;
    designation: string;
    companyName: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    totalEmployee: string;
    revenue: string;
    industry: string;
    hqPhone?: string;
    lineNumber: string;
    mobile: string;
    email: string;
    overview?: string;
    image:string;
    website?:string;

    // 
    openContact?: string;
    nonManager?: string;
    manager?: string;
    directorCount: string;
    cLevel: string;
}

// Define the PeopleModel type with generics for a cleaner Mongoose model definition
export type PeopleModel = Model<IPeople, Record<string, unknown>>;
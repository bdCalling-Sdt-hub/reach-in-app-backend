import mongoose, { Schema } from "mongoose";
import { CompanyModel, ICompany } from "./company.interface";


const CompanySchema = new Schema<ICompany, CompanyModel>(
    {
        company_name: { type: String },
        company_link: { type: String },
        phone: { type: String },
        company_type: { type: String },
        employee_total: { type: String },
        employees: { type: String },
        sales: { type: Number },
        district: { type: String },
        industry: { type: String },
        dunsNumber: { type: String },
        country: { type: String },
        trade: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        address: { type: String },
        headquarters: { type: String },
        decision_hq: { type: String },
        corporate_linkage: { type: String },
        business_description: { type: String },
        contact: { type: String },
        title: { type: String },
        company_for_contact: { type: String },
        corporate_family: { type: String },
        tier: { type: String },
        parent: { type: String },
        corporate_company_name: { type: String },
        corporate_decision_hq: { type: String },
        corporate_headquarters: { type: String },
        corporate_subsidary: { type: String },
        corporate_branch: { type: String },
        corporate_is_decision_hq: { type: String },
        corporate_is_headquarter: { type: String },
        corporate_ownership_type: { type: String },
        corporate_entity_type: { type: String },
        corporate_city: { type: String },
        corporate_state: { type: String },
        corporate_country: { type: String },
        employees_single: { type: String },
        corporate_sales: { type: String },
        corporate_hoovers_industry: { type: String },
        corporate_key_id: { type: String },
        corporate_duns_number: { type: String },
        corporate_hoovers_contacts: { type: String },
        corporate_direct_marketing_status: { type: String },
        image: {
            type: String,
            default: "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
        },
    },
    {
        timestamps: true
    }
);

export const Company: CompanyModel = mongoose.model<ICompany, CompanyModel>("Company", CompanySchema);

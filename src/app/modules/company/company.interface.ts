import { Model } from "mongoose"

export type ICompany ={

}

export type CompanyModel =  Model<ICompany, Record<string, unknown>>;
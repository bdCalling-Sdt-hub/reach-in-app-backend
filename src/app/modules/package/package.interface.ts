import { Model } from "mongoose";

export type IPackage = {
    title: String;
    description: String;
    price: Number;
    duration: 'month' | 'year';
    category: 'Monthly' | 'Yearly';
    productId: String;
    credit: Number;
    paymentLink: string;
}

export type PackageModel = Model<IPackage, Record<string, unknown>>;
import { ProductNameTypes } from "../types";

export interface IProduct {
    id?: string;
    title: string;
    description: string;
    imageURL: string;
    price: string;
    colors: string[];
    category: ICategory;
}

export interface IFormInput {
    id: string;
    name: ProductNameTypes;
    label: string;
    type: string;
}

export interface ICategory {
    id: string;
    name: string;
    imageURL: string;
}

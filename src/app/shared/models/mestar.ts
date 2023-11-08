import { Category } from "./category";
import { City } from "./city";

export interface Mestar{
    id: string;
    firstName: string;
    lastName: string;
    city: City;
    categories: Category[];
    description: string;
    reviews: number;
    rating: number;
    distance: string;
}
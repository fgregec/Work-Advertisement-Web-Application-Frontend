import { Category } from "./category";
import { City } from "./city";
import { BasicUser } from "./user";

export interface Listing{
  id: string;
  user: BasicUser;
  city: City;
  category: Category;
  isEmergency: boolean;
  description: string;
  created: Date;
}


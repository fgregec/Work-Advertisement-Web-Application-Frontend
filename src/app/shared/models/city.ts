import { Country } from "./country";
import { County } from "./county";

export interface City{
    id: string;
    name: string;
    county: County;
    zipCode: number;
    country: Country;
    countyID: string;
}

import { Category } from "./category";
import { City } from "./city";
import { County } from "./county";

export class NatjecajParams {
  emergency: boolean = false;
  categories: Category[] = [];
  counties: County[] = [];
  cities: City[] = [];
  pageIndex: number = 1;
  pageSize: number = 5;
}

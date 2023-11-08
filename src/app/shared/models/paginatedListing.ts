import { Listing } from "./listing";

export interface PaginatedListing{
  count: number;
  data: Listing[];
}

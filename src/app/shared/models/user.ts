import { City } from "./city";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    discriminator: string;
    city: City;
    isMestar: boolean;
}

export class User implements User{


}

export interface UpdateUser{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    cityID: string;
    countyID: string;
    zipCode: number;
}


export class UpdateUser implements UpdateUser{


}

export interface BasicUser{
  id: string;
  firstName: string;
  lastName: string;
}

export class BasicUser implements BasicUser{

}

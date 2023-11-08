export interface RegisterUser{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cityID: string;
  isMestar: boolean;
}

export class RegisterUser implements RegisterUser{

}

export interface LoginUser{
  email: string;
  password: string;
}

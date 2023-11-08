import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdateUser, User } from '../shared/models/user';
import { LoginUser, RegisterUser } from '../shared/models/registerUser';
import { UserInfo } from '../shared/models/user-info';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = "http://localhost:5001/api/Account";
  private user = new BehaviorSubject<UserInfo | null>(null);
  currentUser = this.user.asObservable();

  constructor(private http: HttpClient) {
    var storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.updateUser(JSON.parse(storedUser) as UserInfo);
    }
  }

  getProfile(id: string) {
    return this.http.get<User>(this.baseUrl + '?id=' + id);
  }

  updateProfile(user: UpdateUser) {
    return this.http.post<User>(this.baseUrl + '/update', user);
  }

  registerUser(user: RegisterUser) {
    return this.http.post<User>(this.baseUrl + '/register', user);
  }

  loginUser(user: LoginUser) {
    return this.http.post<UserInfo>(this.baseUrl + '/login', user);
  }

  updateUser(user: UserInfo) {
    this.user.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.user.next(null);
  }

}

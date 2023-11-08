import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { UserInfo } from 'src/app/shared/models/user-info';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  user?: UserInfo | null;

  constructor(public accountService: AccountService) { } // Inject UserService

  ngOnInit(): void {
    this.accountService.currentUser.subscribe(user => this.user = user); // Subscribe to user updates
    var storedUser = localStorage.getItem('user');
    if(storedUser)
      this.user = JSON.parse(storedUser) as UserInfo;
  }


}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUser } from 'src/app/shared/models/registerUser';
import { AccountService } from '../account.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { UserInfo } from 'src/app/shared/models/user-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: true } }
  ]
})
export class LoginComponent {
  validInput: boolean = false;
  @Output() loggedUser = new EventEmitter<UserInfo>();

  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router, private title: Title) {
    this.title.setTitle('Prijava')
   }

   loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  login(){
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.controls['email'].value,
        password: this.loginForm.controls['password'].value,
      } as LoginUser;

    this.accountService.loginUser(user).subscribe({
      next: (userInfo) => {
        this.accountService.updateUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        this.loggedUser.emit(userInfo);
        this.toastr.success('Prijava uspješna!', '', {
          positionClass: 'toast-bottom-right',
        });
        this.router.navigate(['']);
      },
      error: error => {
        {
          this.toastr.error('Prijava neuspješna!');
          this.loginForm.controls['password'].reset();
          this.validInput = true;
        }
      }
    });
  } else{
    this.toastr.error('Niste unijeli sve podatke!');
    this.loginForm.markAllAsTouched();
  }
}

}


import { Component, OnInit } from '@angular/core';
import { User } from "../../models/User";
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../../services/userservice.service";
import { Router } from "@angular/router";

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  err = "";

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService, private router: Router) {  }

  ngOnInit() {
    // if(this.userService.user.role !== "GUEST") this.router.navigate(['/']);
  }

  submit() {
    this.userService.login(this.email.value,this.password.value)
    .subscribe(result => {
      if ("http://localhost:3000/" == result.url) {
        this.router.navigate(['/list'])
      } else {
        this.err = "error";
        this.router.navigate(['/']);
      }
    });
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

}

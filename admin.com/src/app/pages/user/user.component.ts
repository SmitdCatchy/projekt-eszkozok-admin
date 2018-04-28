import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListComponent } from '../list/list.component';
import { UserService } from "../../services/userservice.service";
import { User } from "../../models/User";
import { Router } from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  
  userData: User;

  constructor(private userService: UserService, private router: Router) { }

  warnForm: FormGroup = new FormGroup({
    warn: new FormControl('', [Validators.required])
  });

  get warn(): AbstractControl {
    return this.warnForm.get('warn');
  }

  ngOnInit() {
    this.userData = this.userService.getSelectedUser();
    if(null == this.userData) {
      this.router.navigate(['/list']);
    }
  }

  edit(name: String, email: String, role: String): void {
    this.userService.edit(this.userData._id,  name, email, role);
  }

  submit() {
    console.log("Clear");
  }

  warnBan(date: Date): void {
    if (this.warn.value.length !== 0 && date !== null) {
      this.userService.warn(this.userData._id, this.warn.value);
      this.userService.ban(this.userData._id, date);

    } else if (this.warn.value.length !== 0) {
      this.userService.warn(this.userData._id, this.warn.value);

    } else if (date !== null) {
      this.userService.ban(this.userData._id, date);
    }
  }

}

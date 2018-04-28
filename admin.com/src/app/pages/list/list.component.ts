import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/userservice.service";
import { User } from "../../models/User";
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  roleForm: FormGroup = new FormGroup({
    role: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private router: Router) {}

  users: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  onSelect(user: User): void {
    this.userService.setSelectedUser(user);
    this.router.navigate(['/user/' + user.name]);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(results => {
      let temp = results.result;
      for(let t of temp){
        this.users.push(new User(
          t._id, t.name, t.email, t.password, t.role, t.flag, t.warn, t.ban
        ));
      }
    });
  }

  filterRole(): void {
    if(this.role.value !== "") {
      this.users = this.users.filter(
        user => user.role === this.role.value
      );
    }
  }
  
  filterIsBanned(): void {
    this.users = this.users.filter(
      user => user.ban !== null
    );
  }

  filterIsWarned(): void {
    this.users = this.users.filter(
      user => user.warn.length !== 0
    );
  }

  refresh(): void {
    this.users = [];
    this.loadUsers();
  }

  get role(): AbstractControl {
    return this.roleForm.get('role');
  }
}
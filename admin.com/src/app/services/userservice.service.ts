import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
//import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { RequestOptionsArgs } from '@angular/http';
import { RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

import { User } from '../models/User';

import {ActivatedRoute, Router} from "@angular/router";
import {Routes, Server} from "../utils/ServerRoutes";
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class UserService {

  user: User;
  selectedUser: User;

  constructor(private http: Http, private route: ActivatedRoute) { }

  setSelectedUser(user: User): void {
    this.selectedUser = user;
  }

  getSelectedUser(): User {
    return this.selectedUser;
  }

  getUsers(): Observable<any> {
    return this.http.get(Server.routeTo(Routes.USERS), {withCredentials: true})
      .map(res => res.json())
    }

    getUserById(id: String): Observable<any>{
      let send = {
        _id: id
      };
      return this.http.post(Server.routeTo(Routes.USER), send, {withCredentials: true})
      .map(res => res.json())
    }

    login(email: string, password: string): Observable<any>{
      let send = {
        email: email,
        password: password
      };
      return this.http.post(Server.routeTo(Routes.LOGIN), send, {withCredentials: true});
    }

    logout(): void {
      let send = {
        email: "",
        password: ""
      };
      this.http.post(Server.routeTo(Routes.LOGOUT), send, {withCredentials: true})
      .subscribe(result => console.log(result));
    }

    ban(id: String, date: Date) : void {
      let send = {
        _id: id,
        date: date
      };
      this.http.post(Server.routeTo(Routes.BAN), send, {withCredentials: true})
      .subscribe(result => console.log(result));
    }

    warn(id: String, message: String) : void {
      let send = {
        _id: id,
        message: message
      };
      this.http.post(Server.routeTo(Routes.WARN), send, {withCredentials: true})
      .subscribe(result => console.log(result));
    }

    edit(id: String, name: String, email: String, role: String) : void {
      let send = {
        _id: id,
        name: name,
        email: email,
        role: role
      };
      this.http.post(Server.routeTo(Routes.EDIT), send, {withCredentials: true})
      .subscribe(result => console.log(result));
    }

}

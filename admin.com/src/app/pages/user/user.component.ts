import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userData = {
    name: "Andor",
    email: "a@a.a",
    role: "user",
    flagged: false,
    flags: {
      toxic: {
          value: true,
          num: 3,
          byWho: ["a", "b","c"]
      }
    },
    warn: "",
    ban: new Date()
  };

  constructor() { }

  ngOnInit() {
  }
  submit(){
    console.log(this.userData);
  }

}

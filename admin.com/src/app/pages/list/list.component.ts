import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor() { }

  dummydata = [
    {
      name: "Andor",
      email: "a@a.a",
      role: "admin",
      flagged: false,
      flags: {
        toxic: {
            value: false,
            num: 0,
            byWho: []
        }
      },
      warn: "",
      ban: null
    },
    {
      name: "Baltazar",
      email: "b@b.b",
      role: "user",
      flagged: true,
      flags: [
        {
          toxic: {
              value: true,
              num: 1,
              byWho: [1]
          }
        }
      ],
      warn: "",
      ban: null
    },
    {
      name: "Catchy",
      email: "c@c.c",
      role: "user",
      flagged: false,
      flags: [
        {
          toxic: {
              value: false,
              num: 0,
              byWho: []
          }
        }
      ],
      warn: "",
      ban: true
    },
    {
      name: "David",
      email: "d@d.cd",
      role: "moderator",
      flagged: true,
      flags: [
        {
          toxic: {
              value: true,
              num: 2,
              byWho: [1,2]
          }
        }
      ],
      warn: "warned",
      ban: null
    }

  ]

  ngOnInit() {
    console.log(this.dummydata);
  }

}

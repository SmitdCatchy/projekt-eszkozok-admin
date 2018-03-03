import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdownmenu',
  templateUrl: './dropdownmenu.component.html',
  styleUrls: ['./dropdownmenu.component.scss']
})
export class DropdownmenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  menuState:string = 'out';

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

}

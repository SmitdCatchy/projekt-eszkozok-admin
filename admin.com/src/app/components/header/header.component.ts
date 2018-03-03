import { Component, OnInit, HostListener, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  land:string = "disabled";
  port:string = "disabled";
  login:string = "disabled";

  document_width = document.documentElement.clientWidth;
  document_height = document.documentElement.clientHeight;

  container_width = 1140;
  container_min_height = 0;

  resize(){
    this.document_width = document.documentElement.clientWidth;
    this.document_height = document.documentElement.clientHeight;

    this.isLandscape = document.documentElement.clientWidth >= 720;
    if(window.pageYOffset > 10 && this.isLandscape) {
         this.header_style = "header-small";
         this.header_image_style = "header-image-wide";
         this.account_image_style = "acc-image-small";
         this.land = "";
         this.port = "disabled";
    }
    else if(this.isLandscape){
         this.header_style = "header";
         this.header_image_style = "header-image";
         this.account_image_style = "acc-image";
         this.land = "";
         this.port = "disabled";
    }
    else{
         this.header_style = "header-resp";
         this.header_image_style = "header-image-wide";
         this.account_image_style = "disabled";
         this.land = "disabled";
         this.port = "";
           this.container_width = this.document_width;
    }
  }

  header_style = "header";
  header_image_style = "header-image";
  account_image_style = "acc-image";

  isLandscape = document.documentElement.clientWidth >= 720;

  constructor() {
    this.resize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.resize();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event){
    this.resize();
  }
}

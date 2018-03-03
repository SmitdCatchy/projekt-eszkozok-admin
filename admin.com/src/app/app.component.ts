import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // min-height
    document_height = document.documentElement.clientHeight;
    document_width = document.documentElement.clientWidth;
    container_min_height = 0;

    resize(){
      this.document_height = document.documentElement.clientHeight;
      this.document_width = document.documentElement.clientWidth;
      if(this.document_width < 720) this.container_min_height = this.document_height - 80;
      else this.container_min_height = this.document_height - 120;
    }
    ngOnInit() {
      this.resize();
    }
    @HostListener('window:resize', ['$event'])onResize(event){
      this.resize();
    }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/list/list.component';
import { UserComponent } from './pages/user/user.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

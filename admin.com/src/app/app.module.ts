import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/list/list.component';
import { UserComponent } from './pages/user/user.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/header/navigation/navigation.component';
import { DropdownmenuComponent } from './components/header/dropdownmenu/dropdownmenu.component';

import { UserService } from './services/userservice.service';
import { HttpModule } from '@angular/http';
import { User } from './models/User';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListComponent,
    UserComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    DropdownmenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

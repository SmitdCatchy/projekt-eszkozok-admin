import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/list/list.component';
import { UserComponent } from './pages/user/user.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/header/navigation/navigation.component';
import { DropdownmenuComponent } from './components/header/dropdownmenu/dropdownmenu.component';


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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

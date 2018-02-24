import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './pages/list/list.component';
import { UserComponent } from './pages/user/user.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: '',  component: ListComponent },

  { path: 'user',  component: UserComponent },
  { path: 'user/:name',  component: UserComponent },

  { path: 'login',     component: LoginComponent },

  { path: '**',     redirectTo: '', pathMatch: 'full' }
  // { path: '**',     redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

/**
 * Created by blackbird on 2016/11/12.
 */
import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {RoomComponent} from './index/room.component';
import {LoginComponent}from './login/login.component'
import {RegisterComponent} from "./register/register.component";
import {DataDrivenComponent} from "./test/data-driven/data-driven.component";
import {AuthGuard}from './services/auth-guard.service'

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: '/login', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {path: 'room', canActivate: [AuthGuard],component: RoomComponent},
            {path:'data',canActivate: [AuthGuard],component:DataDrivenComponent},
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

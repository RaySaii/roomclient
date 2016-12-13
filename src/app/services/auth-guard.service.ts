/**
 * Created by blackbird on 2016/11/26.
 */
import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot} from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate{
    url:string;
    constructor(private router:Router) { }
    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean{
        let url:string=state.url;

        return this.checkLogin(url);
    }

    checkLogin(url:string):boolean{
        if (localStorage.getItem('token')){return true}
        console.log('check');
        this.url=url;
        this.router.navigate(['/login']);
        return false
    }
}
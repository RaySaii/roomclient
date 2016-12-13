/**
 * Created by blackbird on 2016/11/26.
 */
import {
    Component, OnInit,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';
import { Http, Headers } from "@angular/http";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { CookieService } from 'angular2-cookie/core'
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'my-user',
    templateUrl: 'user.component.html',
    styleUrls: ['./user.component.css'],
    providers: [CookieService],
    animations: [
        trigger('State', [
            state('inactive', style({
                transform: 'scale(1)'
            })),
            state('active', style({
                transform: 'scale(1.1)'
            })),
            transition('inactive=>active', animate('100ms ease-in')),
            transition('active=>inactive', animate('100ms ease-out'))
        ])
    ]
})
export class UserComponent implements OnInit {
    user: User;
    state: string = 'inactive';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http,
        private userService: UserService,
        private cookieService: CookieService) {
    }

    ngOnInit() {
        let userId = localStorage.getItem('userId');

        this.user = this.userService.getUser(userId);
        this.cookieService.put('username', this.user.username);

    }
    goLogin() {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }

}
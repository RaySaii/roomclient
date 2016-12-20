/**
 * Created by blackbird on 2016/11/27.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { User } from '../models/user';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { URL } from './url';


@Injectable()
export class UserService {
    userUrl = `${process.env.rest}chatusers`;
    user = new User('');

    constructor(private http: Http, private cookieService: CookieService) {
    }
    findUser(username: string) {
        return this.http.get(`${this.userUrl}/findOne?filter[where][username]=${username}`)
    }

    getUser(userId: string) {
        let headers = this.setToken();
        this.http.get(`${this.userUrl}/${userId}`, { headers: headers })
            .map(res => res.json())
            .subscribe(res => {
                this.user.id = res.id;
                this.user.email = res.email;
                this.user.username = res.username;
                this.cookieService.put('username', this.user.username)
            })
        return this.user;
    }

    setToken() {
        let token = localStorage.getItem('token');
        let authHeader = new Headers();
        authHeader.append('Content-Type', 'application/json');
        if (token) {
            authHeader.append('X-Access-Token', token);
        }
        return authHeader;
    }
}
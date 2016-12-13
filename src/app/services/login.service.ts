/**
 * Created by blackbird on 2016/11/18.
 */
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { URL } from './url';

@Injectable()
export class LoginService {
    restUrl = `${process.env.rest}chatusers/dologin`;

    constructor(private http: Http) { }
    login(obj: {}) {
        return this.http.post(this.restUrl, obj)
    }
}
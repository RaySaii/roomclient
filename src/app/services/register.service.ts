/**
 * Created by blackbird on 2016/11/18.
 */
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { URL } from './url';

@Injectable()
export class RegisterService {

    constructor(
        private http: Http) { }
    restUrl = `${process.env.rest}chatusers`;

    register(user: {}) {
        return this.http.post(this.restUrl, user)
    }
    // search(item:string,value:string){
    //     return this.http.get(`${this.restUrl}?filter[where][${item}]=${value}`).map(res=>{!res;console.log(res)})
    // }
    checkUsed(value: string) {
        return this.http.post(`${this.restUrl}/checkused`, { email_name: value })
    }
}
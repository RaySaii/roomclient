/**
 * Created by blackbird on 2016/11/18.
 */
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { URL } from './url';

@Injectable()
export class RegisterService {
    userUrl = `${process.env.rest}chatusers`;

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
    joinRoom(roomId: string) {
        // console.log('服务段执行执行加入', roomId);
        // this.socket.emit('join', roomId);
        let userId = localStorage.getItem('userId');
        // let headers = this.setToken();
        return this.http.post(`${this.userUrl}/joinroom`, { room_id: roomId, user_id: userId });
        // this.socket.on('message',(msg)=>console.log(msg))
    }
}
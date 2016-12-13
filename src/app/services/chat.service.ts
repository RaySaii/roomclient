/**
 * Created by blackbird on 2016/11/13.
 */
import { Injectable } from '@angular/core';
import { User } from '../models/user'
import { Subject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { Message } from '../models/message';
import * as io from 'socket.io-client';
import { CookieService } from "angular2-cookie/services/cookies.service";
import { URL } from './url';


@Injectable()
export class ChatService {
    socketUrl = URL.socket;
    messagesUrl = `${process.env.rest}messages`;
    userUrl = `${process.env.rest}chatusers`;
    roomUrl = `${process.env.rest}rooms`;
    socket = null;
    newMessage: Subject<any> = new Subject<any>();
    userId: string;
    username: string

    constructor(
        private http: Http,
        private cookieService: CookieService
    ) {
        // console.log(process.env.rest);
        this.userId = localStorage.getItem('userId');
        this.username = this.cookieService.get('username');
        this.socket = io(this.socketUrl);

        this.socket.on('connect', () => {
            console.log(`connected! id: ${this.socket.id}`)
            this.socket.emit('info', this.userId, this.username);
        });

        this.socket.on('disconnect', () => {
            this.socket.emit('leave', this.userId)
            console.log(`disconnected! id: ${this.socket.id}`)
        });

        this.socket.on('message', (msg: any) => {
            console.log('客户端收到了信息并加入消息流中')
            this.newMessage.next(msg)
        });

    }

    // on(event: string) {
    //     return Observable.fromEvent(this.socket, event);
    // }

    // emit(event: string, value: Object) {
    //     this.socket.emit(event, value);
    // }
    getRoomMessages(id: string) {
        return this.http.get(`${this.roomUrl}/${id}/messages`).map(res => res.json())
    }
    getRead(id: string, username: string) {
        return this.http.get(`${this.roomUrl}/${id}/messages/count?where[and][0][isRead]=false&where[and][1][username][neq]=${username}`)
    }
    setRead(id: string, username: string) {
        return this.http.post(`${this.messagesUrl}/update?where[and][0][roomId]=${id}&where[and][1][username][neq]=${username}`, { isRead: true })//暂为解决
    }
    sendMessage(roomId: string, msg: Message, obj?: {}) {
        if (obj) {
            this.socket.emit('message', roomId, msg, obj);
        } else {
            console.log('发送给服务器')
            this.socket.emit('message', roomId, msg);
        }
        this.http.post(this.messagesUrl, msg).subscribe(
            // res=>console.log(res),
            // error=>console.log(error)
        )
    }

    joinRoom(roomId: string) {
        // console.log('服务段执行执行加入', roomId);
        this.socket.emit('join', roomId);
        let userId = localStorage.getItem('userId');
        let headers = this.setToken();
        this.http.post(`${this.userUrl}/joinroom`, { room_id: roomId, user_id: userId }, { headers: headers }).subscribe();
        // this.socket.on('message',(msg)=>console.log(msg))
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
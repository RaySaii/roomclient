/**
 * Created by blackbird on 2016/11/14.
 */
import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import { Http, Headers } from '@angular/http'
import { User } from "../models/user";
import { URL } from './url';


@Injectable()
export class RoomService {

    restUrl = `${process.env.rest}/rooms`;
    userUrl = `${process.env.rest}chatusers`;
    constructor(private http: Http) {
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
    getNews() {
        return this.http.get('http://localhost:3000/ping');
    }
    getRooms(id: string) {
        let headers = this.setToken();
        return this.http.get(`${this.userUrl}/${id}/joinedrooms`, { headers: headers }).map(res => res.json())
    }
    addRooms(room: Room) {
        return this.http.post(this.restUrl, room)
    }
    getRoomUsers(id: string) {
        let headers = this.setToken();
        return this.http.get(`${this.restUrl}/${id}/users`)
    }

}
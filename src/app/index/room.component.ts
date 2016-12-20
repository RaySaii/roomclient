/**
 * Created by blackbird on 2016/11/14.
 */
import {
    Component, OnInit, OnChanges, SimpleChanges, ViewChild, OnDestroy,
    trigger,
    state,
    style,
    transition,
    keyframes,
    animate,
} from '@angular/core';
import { RoomService } from '../services/room.service';
import { ChatService } from '../services/chat.service';
import { Room } from "../models/room";
import { Router, ActivatedRoute } from '@angular/router';
import { UserComponent } from "./user.component";
import { UserService } from "../services/user.service";
import { CookieService } from 'angular2-cookie/core';
import { User } from "../models/user";
import { Subject, Subscription } from "rxjs";
import { AfterViewInit } from '@angular/core';
import { NgProgressService } from "ng2-progressbar";
import { LoadingAnimateService } from 'ng2-loading-animate';

@Component({
    selector: 'my-room',
    templateUrl: 'room.component.html',
    styleUrls: ['room.component.css'],
    animations: [
        trigger('Down', [
            state('down', style({
                transform: 'translateY(0)'
            })),
            transition('void=>*', [
                style({ transform: 'translateY(-100%)' }),
                animate('1000ms 2s ease')]),
        ]),
        trigger('Enter', [
            state('in', style({
                transform: 'translateX(0)'
            })),
            transition('void => *', [
                animate(300, keyframes([
                    style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
                    style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.3 }),
                    style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
                ]))
            ]),
        ])
    ],
    providers: [ChatService, RoomService, UserService, CookieService]
})
export class RoomComponent implements OnInit, OnDestroy {

    title = '房间列表';
    rooms: Room[];
    name: string;
    selectedRoom: Room;
    selectedUser: User;
    none: boolean = false;
    preUsers = [];
    users: User[] = [];
    me: User;
    news = [];


    username: string;
    userId: string;

    leaveId: Subject<string> = new Subject<string>();
    okId: Subject<string> = new Subject<string>();
    stateIds: {} = {};

    newMessage = {};
    isRead = {};

    toggle;
    timer: any;
    top: Number = 0;


    constructor(
        private _loadingSvc: LoadingAnimateService,
        private pService: NgProgressService,
        private cookieService: CookieService,
        private chatService: ChatService,
        private roomService: RoomService,
        private userService: UserService,
        private router: Router, private route: ActivatedRoute) {

    }

    start() {
        this._loadingSvc.setValue(true);
    }
    stop() {
        this._loadingSvc.setValue(false);
    }

    ngOnInit() {
        this.start()
        this.chatService.joinRoom('5829b48266e5156306ba4dcf').subscribe(() => {
            // this.start();
            // setTimeout(() => {

            // }, 2000);
            this.chatService.joinRoom('5829b74f66e5156306ba4dd0').subscribe(() => {
                this.roomService.getRoomUsers('5829b74f66e5156306ba4dd0').map(res => res.json()).subscribe(res => {
                    this.preUsers = res
                });
                this.roomService.getRooms(this.userId)
                    .subscribe(rooms => {
                        // console.log(rooms)
                        this.rooms = rooms;
                        this.goChat(this.rooms.find(room => room.id === '5829b48266e5156306ba4dcf'));
                        this.stop();
                        this.top = 999;
                        this.rooms.map(room => {
                            if (!room.name) {
                                this.chatService.getRead(room.id, this.username).map(res => res.json()).subscribe(
                                    res => {
                                        // console.log(res);
                                        this.isRead[room.id] = res.count;
                                    }
                                );
                            }
                            this.chatService.getRoomMessages(room.id).subscribe(
                                msgs => {
                                    this.newMessage[room.id] = msgs.pop()
                                }
                            )
                            this.chatService.joinRoom(room.id)
                        })
                    });
            });
        });


        this.roomService.getNews().map(res => res.json()).subscribe(res => {
            this.news = res;
        });
        this.timer = setInterval(() => {
            this.roomService.getNews().map(res => res.json()).subscribe(res => {
                this.news = res;
            });
        }, 600000);
        this.username = this.cookieService.get('username');
        this.userId = localStorage.getItem('userId');

        this.me = this.userService.getUser(this.userId);
        this.chatService.socket.on('message', (data) => {
            console.log(data);
            if (data.room) {
                if (data.room.from.id === this.me.id) {
                    this.newMessage[data.room.id] = data.msg;
                }
                if (data.room.to.id === this.me.id) {
                    let room = data.room;
                    console.log(room);
                    this.rooms.push(room);
                    this.chatService.joinRoom(room.id);
                    this.newMessage[data.room.id] = data.msg;
                    if (this.selectedRoom && this.selectedRoom.id === data.room.id) {
                        return
                    } else {
                        this.isRead[data.room.id] = 1;
                        console.log(this.isRead)
                    }
                }
            } else {
                this.newMessage[data.roomId] = data;
                if (this.selectedRoom && this.selectedRoom.id === data.roomId) {
                    this.chatService.setRead(this.selectedRoom.id, this.username).map(res => res.json()).subscribe(res => console.log(res));
                    return
                } else {
                    this.isRead[data.roomId]++;
                }
            }
        })
        this.chatService.socket.on('check', () => {
            this.chatService.socket.emit('myId', this.userId);
        })
        this.chatService.socket.on('myId', (userId) => {
            this.okId.next(userId);
        })

        this.chatService.socket.emit('check');

        this.chatService.socket.on('come', (userId) => {
            this.okId.next(userId);
        })
        this.okId.subscribe((id) => {
            this.stateIds[id] = true;
            this.roomService.getRoomUsers('5829b74f66e5156306ba4dd0').map(res => res.json()).subscribe(res => {
                this.preUsers = res
            });
        });
        this.chatService.socket.on('leave', (userId) => {
            this.leaveId.next(userId);
        });
        this.leaveId.subscribe((id) => {
            this.stateIds[id] = false;
        })

    };

    addRooms(to: User) {
        let from = this.me;
        let room = new Room('', from, to);
        this.roomService.addRooms(room)
            .map(res => res.json())
            .subscribe((res) => {
                this.rooms.push(res);
                this.chatService.joinRoom(res.id).subscribe(() => {
                    this.goChat(res);
                });
            });
    }

    goChat(room: Room) {
        console.log('进入')
        if (this.selectedRoom === room) {
            return;
        }
        this.users = [];
        if (room.id === '5829b48266e5156306ba4dcf') {
            this.none = true;
        } else {
            this.none = false;
        };
        this.selectedRoom = room;
        // console.log('进入这个房间', room.id);
        this.isRead[room.id] = null;
        this.chatService.setRead(room.id, this.username).map(res => res.json()).subscribe();
        // this.router.navigate([id],{relativeTo:this.route})  
        if (room.id === '5829b74f66e5156306ba4dd0') {
            console.log('选择')
            this.roomService.getRoomUsers('5829b74f66e5156306ba4dd0').map(res => res.json()).subscribe(res => this.preUsers = res);
            for (let i = 0; i < this.preUsers.length; i++) {
                setTimeout(() => this.users.push(this.preUsers[i]), 100 * i);//延迟时间要变化
            }
            // this.roomService.getRoomUsers(room.id)
            //     .switchMap(res => res.json())
            //     .subscribe(res => {
            //         console.log(res);
            //         for (let i = 0; i < res.length; i++) {
            //             setTimeout(() => this.users.push(res[i]), 100 * i);//延迟时间要变化
            //         }
            //         console.log(this.users);
            //     });
        } else {
            this.users = [];
        }
    }

    toUser(user: User) {
        if (this.userId === user.id) {
            return
        } else {
            let room = this.rooms.filter(room => room.from).find(room => room.from.id === user.id || room.to.id === user.id);
            if (room) {
                this.selectedRoom = room;
                return
            } else {
                this.selectedUser = user;
                this.addRooms(user);
            }
        }

    }
    ngOnDestroy() {
        this.chatService.socket.disconnect();
    }


}
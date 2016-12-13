import { Component, OnInit, Input, OnChanges, SimpleChange, ElementRef, ViewChild, Inject } from '@angular/core';
import { User } from '../models/user'
import { ChatService } from '../services/chat.service';
import { Message } from '../models/message';
import { Room } from "../models/room";
import { UserService } from "../services/user.service";
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'my-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['./chat.component.css'],
    providers: [CookieService]
})
export class ChatComponent implements OnInit, OnChanges {
    @Input() room: Room;
    @Input() user: User;
    text: string;
    messages = [];

    constructor(private el: ElementRef,
        private chatService: ChatService,
        private cookieService: CookieService,
        private userService: UserService) {
    }//只要引用了服务 连接就开启，因为连接在构造函数中
    get username() {
        return this.cookieService.get('username');
    }

    get userId() {
        return localStorage.getItem('userId');
    }
    sendMessage(text: string) {
        if (!text) return;
        let msg = new Message(text, this.room.id, this.username);
        let me = this.userService.getUser(this.userId);
        if (this.user) {
            this.chatService.sendMessage(this.room.id, msg, { from: me, to: this.user });
            this.user = null;
            // this.messages.push(msg);
        } else {
            console.log('向', this.room.id, '发送');
            this.chatService.sendMessage(this.room.id, msg);
        }
        this.text = '';
    }

    // public goBottom(): void {
    //     let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInlineInstance(this.document, '#bottom', this.scroll.nativeElement);
    //     this.pageScrollService.start(pageScrollInstance);
    // };


    ngOnInit() {
        // this.userService.getUser()
        this.chatService.newMessage.subscribe(
            res => {
                console.log(res);
                if (this.room) {
                    if (res.msg) {
                        if (res.room.id === this.room.id) {
                            this.messages.push(res.msg);
                        }
                    }
                    else {
                        if (res.roomId === this.room.id) {
                            this.messages.push(res);
                        }
                    }
                }
            },
            error => console.log(error)
        )
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (this.room) {
            this.chatService.getRoomMessages(this.room.id)
                .subscribe(msgs => {
                    msgs.map(msg => {
                        // msg.sendAt = new Date(msg.sendAt).toLocaleString();
                        // console.log(msg);
                    })
                    this.messages = msgs;
                });
        }
    }


}
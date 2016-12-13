/**
 * Created by blackbird on 2016/11/13.
 */
import {User} from './user';

export class Message {
    id: string;
    username:string;
    content:string;
    roomId:string;
    sendAt: Date;
    isRead:boolean;
    constructor(content:string,roomId:string,username:string){
        this.username=username;
        this.content=content;
        this.roomId=roomId;
        this.sendAt=new Date();
        this.isRead=false;
    }
}
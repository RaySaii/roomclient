/**
 * Created by blackbird on 2016/11/13.
 */
export class User {
        id?:string;
        email:string;
        password:string;
        username:string;
        scoketId:string;
        online:boolean
    constructor(obj:any,socketId?:string) {
        this.email=obj.email;
        this.username=obj.username;
        this.password=obj.password;
        this.scoketId=socketId||'';
        this.online=false;
    }
}
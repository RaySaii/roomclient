import {User} from "./user";
/**
 * Created by blackbird on 2016/11/14.
 */

export class Room{
    id:string;
    name:string;
    from:User;
    to:User;
    constructor(name?:string,from?:User,to?:User){
        this.name=name;
        this.from=from;
        this.to=to;
    }
}
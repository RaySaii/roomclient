/**
 * Created by blackbird on 2016/12/2.
 */

import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

@Pipe({
    name: 'myTime'
})

export class MyTimePipe implements PipeTransform {
    transform(value: any, args: any[]): any {
        return moment(value).fromNow();
    }
}
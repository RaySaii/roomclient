/**
 * Created by blackbird on 2016/12/7.
 */
import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'my-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
    @Input() news: any;

    constructor(
    ) {
    }

    ngOnInit() {

    }

}
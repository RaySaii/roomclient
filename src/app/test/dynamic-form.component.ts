/**
 * Created by blackbird on 2016/11/16.
 */
import {Component, OnInit, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {QuestionBase} from './formBase/question-base';
import {QuestionControlService} from './question-control.service';

@Component({
    selector: 'dynamic-form',
    templateUrl: 'dynamic-form.component.html',
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {

    @Input() questions: QuestionBase<any>[] = [];
    form: FormGroup;
    payLoad = '';

    constructor(private qcs: QuestionControlService) {
    }

    ngOnInit() {
        this.form = this.qcs.toFormGroup(this.questions);
    }
    get info(){
        return JSON.stringify(this.form.value)
    }
    onSubmit(){
        this.payLoad=JSON.stringify(this.form.value);
    }

}
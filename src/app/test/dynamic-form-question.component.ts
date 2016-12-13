/**
 * Created by blackbird on 2016/11/16.
 */
import {Component,Input} from '@angular/core' ;
import {FormGroup} from '@angular/forms';

import {QuestionBase} from './formBase/question-base';
import {DropDownQuestion} from './formBase/question-dropdown';

@Component({
    selector:'df-question',
    templateUrl:'dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent{
    @Input() question:QuestionBase<any>;
    @Input() form:FormGroup;
    get isValid(){
        return this.form.controls[this.question.key].valid;
    }
}
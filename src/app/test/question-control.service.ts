/**
 * Created by blackbird on 2016/11/16.
 */
import {Injectable} from '@angular/core' ;
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {QuestionBase} from './formBase/question-base';

@Injectable()
export class QuestionControlService {
    constructor() {
    }

    toFormGroup(question: QuestionBase<any>[]) {
        let group: any = {};
        question.forEach(question => {
            group[question.key] = question.required ?
                new FormControl(question.value || '', Validators.required) :
                new  FormControl(question.value||'');
        })
        return new FormGroup(group);
    }
}
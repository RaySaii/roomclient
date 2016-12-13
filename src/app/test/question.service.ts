/**
 * Created by blackbird on 2016/11/16.
 */
import { Injectable } from '@angular/core';
import {QuestionBase}from './formBase/question-base'
import {DropDownQuestion} from './formBase/question-dropdown';
import {TextboxQuestion} from './formBase/question-textbox'

@Injectable()
export class QuestionService {

    constructor() { };
    getQuestions(){
        let questions:QuestionBase<any>[]=[
            new DropDownQuestion({
                key:'brave',
                label:'Bravery Rating',
                options:[
                    {key:'solid',value:"Solid"},
                    {key:'great',value:'Great'},
                    {key:'good',value:'Good'},
                    {key:'unproven',value:'Unproven'}
                ],
                order:3
            }),
            new TextboxQuestion({
                key: 'firstName',
                label: 'First name',
                value: 'Bombasto',
                required: true,
                order: 1
            }),
            new TextboxQuestion({
                key: 'emailAddress',
                label: 'Email',
                type: 'email',
                order: 2
            })
        ]
        return questions.sort((a,b)=>a.order-b.order);
    }

}
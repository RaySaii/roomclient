/**
 * Created by blackbird on 2016/11/16.
 */
import {QuestionBase} from './question-base';
export class TextboxQuestion extends QuestionBase<string>{
    controlType='textbox';
    type:string;

    constructor(options:{}={}){
        super(options);
        this.type=options['type']||'';
    }
}
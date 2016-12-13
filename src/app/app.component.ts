import { Component } from '@angular/core';
import { QuestionService } from './test/question.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [QuestionService]
})
export class AppComponent {
    title = 'app works!';
    questions: any[];

    constructor(private service: QuestionService) {
        this.questions = service.getQuestions();
    }


}

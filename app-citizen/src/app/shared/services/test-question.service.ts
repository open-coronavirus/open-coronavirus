import { Injectable } from "@angular/core";
import { TestQuestion } from '../sdk/model/testQuestion';
import { TestQuestionControllerService } from '../sdk/api/testQuestionController.service';
import { indexOfArrayByKey } from '../../../../../app-health/src/app/shared/utils/utils';

@Injectable()
export class TestQuestionService {

    public questions: Array<TestQuestion>;

    public constructor(
        protected testQuestionControllerService: TestQuestionControllerService) {

        this.loadQuestions();
    }

    public loadQuestions() {
        this.testQuestionControllerService.testQuestionControllerFind().subscribe(questions => {
            this.questions = questions;
        });
    }

    public getQuestion(idQuestion: string) {
        const index = indexOfArrayByKey('questionId', idQuestion, this.questions);
        if (index >= 0) {
            return this.questions[index];
        }
        return;
    }

}

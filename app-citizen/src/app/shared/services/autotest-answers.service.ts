import {Injectable} from '@angular/core';


@Injectable()
export class AutotestAnswers {

    protected answers = [];

    public addAnswer(question, level, answer) {
        this.answers[level] = {
            questionId: question.questionId,
            question: question.hasOwnProperty('question')?question.question:question.title,
            answer: answer
        }
        this.answers = this.answers.slice(0, +level + 1); //remove positions at right;
    }

    public getAnswers() {
        return this.answers;
    }

    public getScore() {
        let returnValue = 0;
        this.answers.forEach(answer => {
            if(answer.answer.hasOwnProperty('value')) {
                returnValue += answer.answer.value;
            }
        });

        return returnValue;
    }

}

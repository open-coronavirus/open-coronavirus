import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {Subscription} from 'rxjs';
import {AutotestAnswers} from '../../shared/services/autotest-answers.service';
import {
    TestQuestion,
    TestQuestionControllerService,
    TestResultControllerService,
    TestResultWithRelations
} from "../../shared/sdk";
import {PatientService} from "../../shared/services/patient.service";
import {TestActionEnum, TestResultEnum} from "../../../../../common/utils/enums";


@Component({
    selector: 'autotest',
    templateUrl: 'autotest.component.html',
    styleUrls: ['autotest.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AutotestComponent implements OnInit, OnDestroy {

    public title: string;
    public subtitle: string;
    public questionText: string;
    public questionId;
    public level;

    public showExitButton = false;

    public commonTarget: string;

    public currentQuestion: TestQuestion;

    protected subscriptions: Array<Subscription> = new Array();

    constructor(protected activatedRoute: ActivatedRoute,
                protected location: Location,
                protected patientService: PatientService,
                protected testQuestionControllerService: TestQuestionControllerService,
                protected testResultControllerService: TestResultControllerService,
                protected autotestAnswers: AutotestAnswers,
                protected router: Router) {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if(params.hasOwnProperty('question_id')) {
                this.questionId = params['question_id'];
                this.level = params['level'];
            }
            else {
                this.questionId = 'question0';
                this.level = 0;
            }

            this.testQuestionControllerService.testQuestionControllerFindByQuestionId(this.questionId).subscribe(question => {
                this.currentQuestion = question;

                if(this.currentQuestion.hasOwnProperty('target')) {
                    this.commonTarget = this.currentQuestion.target;
                }
                else {
                    this.commonTarget = null;
                }

                if(this.currentQuestion.hasOwnProperty('title')) {
                    this.title = this.currentQuestion.title;
                }
                else {
                    this.title = null;
                }

                if(this.currentQuestion.hasOwnProperty('showExitButton')) {
                    this.showExitButton = this.currentQuestion.showExitButton;
                }
                else {
                    this.showExitButton = false;
                }

                if(this.currentQuestion.hasOwnProperty('subtitle')) {
                    this.subtitle = this.currentQuestion.subtitle;
                }
                else {
                    this.subtitle = null;
                }
                if(this.currentQuestion.hasOwnProperty('question')) {
                    this.questionText = this.currentQuestion.question;
                }
                else {
                    this.questionText = null;
                }
            });

        }));
    }

    public ngOnInit(): void {
    }

    public answer(answer: any) {
        let target;

        this.autotestAnswers.addAnswer(this.currentQuestion, this.level, answer);

        console.log(this.autotestAnswers.getAnswers());

        if(answer.hasOwnProperty('target')) {
            target = answer.target;
        }
        else if(this.commonTarget) {
            target = this.commonTarget;
        }

        if(target == 'testresult') {

            let testResult: TestResultWithRelations = new class implements TestResultWithRelations {
                [key: string]: object | any;

                answers: Array<object>;
                patientId: string;
            }

            testResult.answers = this.autotestAnswers.getAnswers();
            testResult.patientId = this.patientService.patient.id;

            this.testResultControllerService.testResultControllerCreate(testResult).subscribe(testResultFromServer => {
                if (testResultFromServer.result == TestResultEnum.CORONAVIRUS_SUSPICIOUS) { //SUSPICIOUS, SHOW PHONES
                    switch(testResultFromServer.action) {
                        case TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HEALTH_CENTER:
                            target = "schedule_test_appointment_at_health_center";
                            break;
                        case TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HOME:
                            target = "schedule_test_appointment_at_home";
                            break;
                        case TestActionEnum.SHOW_PHONE_INFORMATION:
                        default:
                            target = "recommendations_and_contact_phones";
                            break;
                    }
                }
                else {
                    target = "result_ok";
                }
            });

        }

        if(target.startsWith("http")) {
            window.open(target, "_system");
        }
        else if(target == 'schedule_test_appointment_at_health_center') {
            this.router.navigate(['/app/schedule-appointment-at-health-center']);
        }
        else if(target == 'schedule_test_appointment_at_home') {
            this.router.navigate(['/app/schedule-appointment-at-home']);
        }
        else {
            const nextLevel = +this.level + 1;
            this.router.navigate(['/app/autotest/' + nextLevel + '/' + target]);
        }
    }

    public goBack() {
        this.location.back();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

    public backToHome() {
        this.router.navigate(['/app/home'])
    }

}

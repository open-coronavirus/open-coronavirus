import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {Subscription} from 'rxjs';
import {AutotestAnswers} from '../../shared/services/autotest-answers.service';
import {TestQuestion, TestQuestionControllerService, TestResultControllerService} from "../../shared/sdk";
import {PatientService} from "../../shared/services/patient.service";
import {TestActionEnum} from "../../../../../server/src/common/utils/enums";
import {TestResultService} from "../../shared/services/test-result.service";


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

    public questionnaireId: string;

    public currentQuestion: TestQuestion;

    protected subscriptions: Array<Subscription> = new Array();

    constructor(protected activatedRoute: ActivatedRoute,
                protected location: Location,
                protected testResultService: TestResultService,
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

            if(params.hasOwnProperty('questionnaire_id')) {
                this.questionnaireId = params['questionnaire_id'];
            }

            this.subscriptions.push(this.testQuestionControllerService.testQuestionControllerFindByQuestionId(this.questionId).subscribe(question => {
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
            }));

        }));
    }

    public ngOnInit(): void {
    }

    public answer(answer: any) {
        let target;

        this.autotestAnswers.addAnswer(this.currentQuestion, this.level, answer);

        if(answer.hasOwnProperty('target')) {
            target = answer.target;
        }
        else if(this.commonTarget) {
            target = this.commonTarget;
        }

        if(target == 'testresult') {

            this.subscriptions.push(this.testResultService.sendTestAnswers(this.autotestAnswers.getAnswers(), this.questionnaireId).subscribe(success => {

                if(success) {
                    //even if we have send the test, wait until the result is loaded again (to ensure that
                    //we are working with the server version of the object
                    this.subscriptions.push(this.testResultService.testResultLoaded$.subscribe(loaded => {
                        if(loaded) {

                            switch (this.testResultService.testResult.action) {
                                case TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HEALTH_CENTER:
                                    this.router.navigate(['/app/test-appointment/at-health-center/request']);
                                    break;
                                case TestActionEnum.SCHEDULE_TEST_APPOINTMENT_AT_HOME:
                                    this.router.navigate(['/app/test-appointment/at-home/request']);
                                    break;
                                case TestActionEnum.SHOW_PHONE_INFORMATION:
                                default:
                                    target = "recommendations_and_contact_phones";
                                    const nextLevel = +this.level + 1;
                                    this.router.navigate(['/app/autotest/' + nextLevel + '/' + target]);
                                    break;
                            }
                        }
                    }));

                }

            }));

        }
        else {

            if (target.startsWith("http")) {
                window.open(target, "_system");
            } else {
                const nextLevel = +this.level + 1;
                this.router.navigate(['/app/autotest/' + this.questionnaireId + '/' + nextLevel + '/' + target]);
            }
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

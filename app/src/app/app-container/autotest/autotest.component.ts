import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

import {question0} from './testcontent/0.autotest';
import {question1_1} from './testcontent/1.1.has-viajado';
import {question1_2} from './testcontent/1.2.contacto-con-viajeros';
import {question1_3} from './testcontent/1.3.tengo-sintomas';
import {question1_4} from './testcontent/1.4.tiempo-sintomas';
import {question1_5} from './testcontent/1.5.intensidad-dolor';
import {question2_1} from './testcontent/2.1.estoy-aislado';
import {question3_1} from './testcontent/3.1.positivo';
import {recommendations_and_contact_phones} from './testcontent/consejos-y-telefonos-contacto';
import {isolation_place_recommendations} from './testcontent/isolation-place-recommendations';
import {result_ok} from './testcontent/resultado-ok-coronavirus';
import {wait_to_results_and_contact_phones} from './testcontent/esperar-resultados-telefonos-contacto';
import {wait_to_be_contacted_and_contact_phones} from './testcontent/esperar-contacto-y-telefonos-contacto';
import {Subscription} from 'rxjs';
import {CoronavirusScoreService} from '../../shared/services/coronavirus-score.service';


@Component({
    selector: 'autotest',
    templateUrl: 'autotest.component.html',
    styleUrls: ['autotest.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AutotestComponent implements OnInit, OnDestroy {

    public answers = [];

    public answersParamPrefix = "";

    public currentLevel = 0;

    public questionnaireLabel = "";

    public title: string;
    public subtitle: string;
    public questionText: string;
    public questionId;

    public showExitButton = false;

    public commonTarget: string;

    public currentQuestion;

    protected subscriptions: Array<Subscription> = new Array();

    protected questions = {
        question0: question0,
        question1_1: question1_1,
        question1_2: question1_2,
        question1_3: question1_3,
        question1_4: question1_4,
        question1_5: question1_5,
        question2_1: question2_1,
        question3_1: question3_1,
        recommendations_and_contact_phones: recommendations_and_contact_phones,
        isolation_place_recommendations: isolation_place_recommendations,
        result_ok: result_ok,
        wait_to_results_and_contact_phones: wait_to_results_and_contact_phones,
        wait_to_be_contacted_and_contact_phones: wait_to_be_contacted_and_contact_phones
    }

    constructor(protected activatedRoute: ActivatedRoute,
                protected location: Location,
                protected coronavirusScoreService: CoronavirusScoreService,
                protected router: Router) {
        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            if(params.hasOwnProperty('question_id')) {
                this.questionId = params['question_id'];
            }
            else {
                this.questionId = 'question0';
                this.coronavirusScoreService.score = 0;
            }
            this.currentQuestion = this.questions[this.questionId];
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
    }

    public ngOnInit(): void {
    }

    public answer(answer: any) {
        let target;
        if(answer.hasOwnProperty('target')) {
            target = answer.target;
        }
        else if(this.commonTarget) {
            target = this.commonTarget;
        }

        if(answer.hasOwnProperty('value')) {
            this.coronavirusScoreService.score += +answer.value;
            console.log(this.coronavirusScoreService.score);
        }

        if(target == 'testresult') {
            if(this.coronavirusScoreService.score > 0) {
                target = "recommendations_and_contact_phones";
            }
            else {
                target = "result_ok";
            }
        }

        if(target.startsWith("http")) {
            window.open(target, "_system");
        }
        else {
            this.router.navigate(['/app/autotest/' + target]);
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

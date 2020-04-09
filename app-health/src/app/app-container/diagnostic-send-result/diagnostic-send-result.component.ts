import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PatientWithRelations } from 'src/app/shared/sdk';


@Component({
    selector: 'diagnostic-send-result',
    templateUrl: 'diagnostic-send-result.component.html',
    styleUrls: ['diagnostic-send-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DiagnosticSendResultComponent {

    public patient: PatientWithRelations;

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected loadingController: LoadingController,
        protected location: Location) {

        this.route.queryParams.subscribe(params => {
            this.patient = JSON.parse(params['patient']);
        });
    }

    public goBack() {
        this.location.back();
    }
}

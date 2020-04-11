import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PatientWithRelations, LeaveRequestWithRelations, LeaveRequestControllerService } from 'src/app/shared/sdk';


@Component({
    selector: 'qr-reader-result',
    templateUrl: 'qr-reader-result.component.html',
    styleUrls: ['qr-reader-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderResultComponent implements OnInit {

    private patient: PatientWithRelations;
    private leaveRequests: LeaveRequestWithRelations;

    public showMore: boolean;

    constructor(
        private route: ActivatedRoute,
        protected router: Router,
        protected loadingController: LoadingController,
        private leaveRequestControllerService: LeaveRequestControllerService,
        protected location: Location) {

        this.route.queryParams.subscribe(params => {
            this.patient = JSON.parse(params['patient']);
        });
    }

    ngOnInit() {
        this.getLeaveRequests(this.patient.id);
    }

    getTextStatus() {
        if (!this.patient) {
            return;
        }
        switch (this.patient.status) {
            case 4:
                return $localize`:@@qrresultpositive:Positivo`;

            case 3:
                return $localize`:@@qrresultquarantine:Cuarentena obligatoria`;

            case 2:
                return $localize`:@@qrresultnegative:Negativo`;

            default:
                return $localize`:@@qrresultunknown:Desconocido`;
        }
    }

    getClassStatus() {
        if (!this.patient) {
            return;
        }
        switch (this.patient.status) {
            case 4:
                return 'result--infected';

            case 3:
                return 'result--quarentine';

            case 2:
                return 'result--ok';

        }
    }

    async getLeaveRequests(idPatient: string) {
        const loading = await this.loadingController.create({
            message: $localize`:@@pleaseWait:Por favor, espere`
        });

        await loading.present();

        this.leaveRequestControllerService.leaveRequestControllerGetLeaveRequestsByPatientId(idPatient).subscribe(leaveRequests => {
            loading.dismiss();
            this.leaveRequests = leaveRequests;
        }, err => {
            loading.dismiss();
        });
    }

    public hoursOutsideHome(outOfHomeTimestamp: string) {
        if (!outOfHomeTimestamp) {
            return;
        }

        const now = new Date();
        const outOfHomeDate = new Date(outOfHomeTimestamp);
        const hours = (Math.abs(now.getTime() - outOfHomeDate.getTime()) / 36e5);
        const min = Math.floor((hours % 1) * 60);
        const hoursMath = Math.floor(hours);

        let str = '';
        if (hoursMath) {
            str += hoursMath + 'h ';
        }
        str += min + 'min';
        return str;
    }

    public getColorStatus() {
        if (!this.patient) {
            return;
        }
        switch (this.patient.status) {
            case 4:
                return '#c80f2eff';

            case 3:
                return '#ffca08ff';

            case 2:
                return '#61bc7cff';
        }
    }

    public clickShowMore() {
       this.showMore = true;
    }

    public goBack() {
        this.location.back();
    }

}

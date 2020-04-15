import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PatientWithRelations, LeaveRequestWithRelations, LeaveRequestControllerService } from 'src/app/shared/sdk';
import moment from 'moment';
import {AppointmentType, PatientStatus} from "../../../../../server/src/common/utils/enums";


@Component({
    selector: 'qr-reader-result',
    templateUrl: 'qr-reader-result.component.html',
    styleUrls: ['qr-reader-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderResultComponent implements OnInit {

    private patient: PatientWithRelations;
    private leaveRequests: LeaveRequestWithRelations;

    public showMap: boolean;
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
            case PatientStatus.IMMUNE:
                return $localize`:@@qrresultimmune:Inmune`;
            case PatientStatus.INFECTED:
                return $localize`:@@qrresultpositive:Positivo`;

            case PatientStatus.INFECTION_SUSPECTED:
                return $localize`:@@qrresultquarantine:Cuarentena obligatoria`;

            case PatientStatus.UNINFECTED:
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
            case PatientStatus.IMMUNE:
                return 'result--immune';
            case PatientStatus.INFECTED:
                return 'result--infected';
            case PatientStatus.INFECTION_SUSPECTED:
                return 'result--quarentine';
            case PatientStatus.UNINFECTED:
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
            case PatientStatus.IMMUNE:
                return '#61bc7cff';
            case PatientStatus.INFECTED:
                return '#c80f2eff';

            case PatientStatus.INFECTION_SUSPECTED:
                return '#ffca08ff';

            case PatientStatus.UNINFECTED:
                return '#61bc7cff';
        }
    }

    public clickShowMore() {
       this.showMore = true;
    }

    public clickShowMap() {
        this.showMap = true;
    }
    public getYearsOld(birthday) {
        return moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years');
    }

    public goBack() {
        this.location.back();
    }

    get PatientStatus(): any {
        return PatientStatus;
    }
}

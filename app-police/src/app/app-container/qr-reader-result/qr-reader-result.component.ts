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
        const now = new Date();
        const outOfHomeDate = new Date(outOfHomeTimestamp);
        return Math.round(Math.abs(now.getTime() - outOfHomeDate.getTime()) / 36e5);
    }

    public goBack() {
        this.location.back();
    }

}

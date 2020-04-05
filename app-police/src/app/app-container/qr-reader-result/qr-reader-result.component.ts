import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PatientService } from '../../shared/services/patient.service';


@Component({
    selector: 'qr-reader-result',
    templateUrl: 'qr-reader-result.component.html',
    styleUrls: ['qr-reader-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderResultComponent implements OnInit {

    private patient;

    constructor(
        public userService: UserService,
        private route: ActivatedRoute,
        protected router: Router,
        protected loadingController: LoadingController,
        private patientService: PatientService,
        protected location: Location) {


        this.route.queryParams.subscribe(params => {
            this.patient = JSON.parse(params['patient']);
            console.log("consttuctor data: ", this.patient);
        });
    }

    ngOnInit() {
        this.getPatient(this.patient.id);
    }


    async getPatient(idPatient: string) {
        const loading = await this.loadingController.create({
            message: $localize`:@@pleaseWait:Por favor, espere`
        });
        await loading.present();

        this.patientService.getPatientDetail(idPatient).subscribe(patient => {
            loading.dismiss();
            if (patient != null && patient != false) {
                loading.dismiss();
                this.patient = patient;
            } else {
                // no patient foundit
                loading.dismiss();
                // this.router.navigate(['/no-access']);
            }
        }, err => {
            console.log("getPatientDetail err: ", err);
            loading.dismiss();
        });
    }

    public goBack() {
        this.location.back();
    }

}

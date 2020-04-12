import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { TestAppointmentService } from "../../../shared/services/test-appointment.service";
import { NavController } from '@ionic/angular';


@Component({
    selector: 'confirm-test-appointment',
    templateUrl: 'confirm-test-appointment.component.html',
    styleUrls: ['confirm-test-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmTestAppointmentComponent implements OnDestroy {

    protected subscriptions: Array<Subscription> = new Array();
    protected appointmentType: string;

    constructor(protected activatedRoute: ActivatedRoute,
        protected testAppointmentService: TestAppointmentService,
        protected location: Location,
        private navCtrl: NavController,
        protected router: Router) {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.appointmentType = params['appointment-type'];
        }));

    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

    public back() {
        // this.location.back();
        this.navCtrl.back();
    }

    public requestTest() {

        this.testAppointmentService.requestTestAppointment().subscribe(requested => {
            if (requested) {
                this.router.navigate(['/app/test-appointment/' + this.appointmentType + '/result']);
            } else {
                // error?
            }
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}

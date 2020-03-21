import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Location} from "@angular/common";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TestAppointmentService} from "../../../shared/services/test-appointment.service";


@Component({
    selector: 'autotest-result',
    templateUrl: 'request-test-appointment.component.html',
    styleUrls: ['request-test-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RequestTestAppointmentComponent implements OnDestroy {

    protected subscriptions: Array<Subscription> = new Array();
    protected appointmentType: string;
    protected isCoronavirusSuspicious: boolean = false;

    constructor(protected activatedRoute: ActivatedRoute,
                protected location: Location,
                protected testAppointmentService: TestAppointmentService,
                protected router: Router) {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.appointmentType = params['appointment-type'];
        }));

    }

    public goBack() {
        this.location.back();
    }

    public requestTest() {

        this.router.navigate(['/app/test-appointment/' + this.appointmentType + '/confirm']);

    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}

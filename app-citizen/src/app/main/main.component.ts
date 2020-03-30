import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ShareService} from '../shared/services/share.service';
import {PatientService} from '../shared/services/patient.service';
import {LeaveRequestService} from '../shared/services/leave-request.service';
import {Subscription} from "rxjs";
import {TestAppointmentService} from "../shared/services/test-appointment.service";

@Component({
    selector: 'app-container',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnDestroy {

    public leaveStatus: number;
    public patientHasTestAppointment = false;

    public patientName;
    public patientInitials;
    protected subscriptions: Array<Subscription> = new Array();

    constructor(protected menu: MenuController,
                protected router: Router,
                protected patientService: PatientService,
                protected leaveRequestService: LeaveRequestService,
                protected testAppointmentService: TestAppointmentService,
                protected shareService: ShareService) {

        this.subscriptions.push(this.leaveRequestService.loaded$.subscribe(loaded => {
            if(loaded && this.leaveRequestService.leaveRequest != null) {
                this.leaveStatus = this.leaveRequestService.leaveRequest.status;
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {
                this.patientName = this.patientService.patient.firstName + " " + this.patientService.patient.lastName;
                this.patientInitials = this.patientService.patient.firstName.split(" ").map(elem => elem[0]).join("").toUpperCase();
            }
        }));

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if(loaded) {
                this.patientHasTestAppointment = true;
            }
        }));

    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    closeMenu() {
        this.menu.close('menu');
    }

    public goToHome() {
        this.closeMenu();
        this.router.navigate(['/app/home']);
    }

    public goToRequestLeaveHome() {
        this.closeMenu();
        this.router.navigate(['/app/request-leave-home']);
    }

    public setAtHome() {
        this.closeMenu();
        this.leaveRequestService.setAtHome();
    }

    public goToAutotest() {
        this.closeMenu();
        this.router.navigate(['/app/autotest']);
    }

    public goToCoronavirusInfo() {
        this.closeMenu();
        window.open("https://coronavirus.epidemixs.org/#/opening", '_system');
    }

    public goToMyInfo() {
        this.closeMenu();
        this.router.navigate(['/app/my-info'])
    }

    public share() {
        this.shareService.share();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}

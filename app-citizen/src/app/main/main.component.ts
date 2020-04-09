import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShareService } from '../shared/services/share.service';
import { PatientService } from '../shared/services/patient.service';
import { LeaveRequestService } from '../shared/services/leave-request.service';
import { Subscription } from "rxjs";
import { TestAppointmentService } from "../shared/services/test-appointment.service";
import { PrivacityConditionsService } from '../shared/services/privacityConditions.service';

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

    constructor(
        protected menu: MenuController,
        protected router: Router,
        @Inject('settings') protected settings,
        protected patientService: PatientService,
        protected leaveRequestService: LeaveRequestService,
        protected testAppointmentService: TestAppointmentService,
        private privacityConditionsService: PrivacityConditionsService,
        protected shareService: ShareService) {

        this.subscriptions.push(this.leaveRequestService.loaded$.subscribe(loaded => {
            if (loaded && this.leaveRequestService.leaveRequest != null) {
                this.leaveStatus = this.leaveRequestService.leaveRequest.status;
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                const { firstName, lastName } = this.patientService.patient;
                this.patientName = `${firstName} ${lastName}`;
                this.patientInitials = firstName.split(" ").map(elem => elem[0]).join("").toUpperCase();
            }
        }));

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if (loaded) {
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

    public requestTest() {
        this.closeMenu();
        // this.router.navigate(['/app/xxxx']);
    }

    public goToTracking() {
        this.closeMenu();
        // this.router.navigate(['/app/xxxx']);
    }

    public goToCoronavirusInfo() {
        this.closeMenu();
        window.open(this.settings.moreInfoUrl, '_system');
    }

    public goToMyInfo() {
        this.closeMenu();
        this.router.navigate(['/app/my-info']);
    }

    public share() {
        this.shareService.share();
    }

    showPrivacityConditions(ev) {
        ev.preventDefault();
        this.privacityConditionsService.showPrivacityConditions();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    public getSettingsText(): string {
        return this.settings.shareApp.text;
    }
}

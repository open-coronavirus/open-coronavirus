import {Component, Inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ShareService} from '../shared/services/share.service';
import {PatientService} from '../shared/services/patient.service';
import {LeaveRequestService} from '../shared/services/leave-request.service';
import {Subscription} from "rxjs";
import {TestAppointmentService} from "../shared/services/test-appointment.service";
import {PrivacityConditionsService} from '../shared/services/privacityConditions.service';
import {GeolocationTrackingService} from "../shared/services/tracking/geolocation-tracking.service";
import {BluetoothTrackingService} from "../shared/services/tracking/bluetooth-tracking.service";
import {PermissionsService} from "../shared/services/permissionsService.service";

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
        protected geolocationtrackingService: GeolocationTrackingService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected leaveRequestService: LeaveRequestService,
        protected testAppointmentService: TestAppointmentService,
        protected permissionsService: PermissionsService,
        private privacityConditionsService: PrivacityConditionsService,
        protected shareService: ShareService) {

        this.subscriptions.push(this.leaveRequestService.loaded$.subscribe(loaded => {
            if (loaded && this.leaveRequestService.leaveRequest != null) {
                this.leaveStatus = this.leaveRequestService.leaveRequest.status;
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.patientName = this.patientService.patient.firstName;
                this.patientInitials = this.patientName.split(" ").map(elem => elem[0]).join("").toUpperCase();
            }
        }));

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if (loaded) {
                this.patientHasTestAppointment = true;
            }
        }));

        //start tracking at this point in case the permissions are already granted
        //and no popups will be shown to the end user
        if(!permissionsService.requestedPermissions) {
            this.startGeoTracking();
            this.startBluetoothTracking();
        }
    }


    public startGeoTracking() {
        if(this.settings.permissions.gps) {
            this.geolocationtrackingService.startBackgroundGeolocation();
        }
    }

    public startBluetoothTracking() {
        if(this.settings.permissions.bluetooth) {
            this.bluetoothTrackingService.startBluetoothTracking();
        }
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
        this.router.navigate(['/app/autotest/autotest']);
    }

    public requestTest() {
        this.closeMenu();
        this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
    }

    public goToTracking() {
        this.closeMenu();
        this.router.navigate(['/app/autotest/tracking/0/seguimiento1_1']);
    }

    public goAbout() {
        this.closeMenu();
        this.router.navigate(['/app/about']);
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

    public showPrivacityConditions(ev) {
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

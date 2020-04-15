import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import {MenuController, Platform} from '@ionic/angular';
import { Router } from '@angular/router';
import { ShareService } from '../shared/services/share.service';
import { PatientService } from '../shared/services/patient.service';
import { LeaveRequestService } from '../shared/services/leave-request.service';
import { Subscription } from "rxjs";
import { TestAppointmentService } from "../shared/services/test-appointment.service";
import { PrivacityConditionsService } from '../shared/services/privacityConditions.service';
import { GeolocationTrackingService } from "../shared/services/tracking/geolocation-tracking.service";
import { BluetoothTrackingService } from "../shared/services/tracking/bluetooth-tracking.service";
import { PermissionsService } from "../shared/services/permissionsService.service";
import { ContactTrackerService } from '../shared/services/contacts/contact-tracker.service';
import { PushNotificationService } from "../shared/services/push-notification.service";
import {PatientStatus} from "../../../../server/src/common/utils/enums";

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

    public immuneStatus = PatientStatus.IMMUNE;

    constructor(
        protected menu: MenuController,
        protected router: Router,
        @Inject('settings') public settings,
        public patientService: PatientService,
        protected geolocationtrackingService: GeolocationTrackingService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected leaveRequestService: LeaveRequestService,
        protected pushNotificationService: PushNotificationService,
        protected testAppointmentService: TestAppointmentService,
        protected permissionsService: PermissionsService,
        protected platform: Platform,
        private privacityConditionsService: PrivacityConditionsService,
        protected shareService: ShareService,
        protected contactTrackerService: ContactTrackerService) {

        this.subscriptions.push(this.leaveRequestService.loaded$.subscribe(loaded => {
            if (loaded && this.leaveRequestService.leaveRequest != null) {
                this.leaveStatus = this.leaveRequestService.leaveRequest.status;
            }
        }));

        this.subscriptions.push(this.patientService.patientDataChanged$.subscribe(loaded => {
            if (loaded) {
                this.patientName = this.patientService.patient.firstName;
                this.patientInitials = this.patientName.charAt(0).toUpperCase();
            }
        }));

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if (loaded) {
                this.patientHasTestAppointment = true;
            }
        }));

        //start tracking at this point in case the permissions are already granted
        //and no popups will be shown to the end user
        if(!permissionsService.permissionsRequested) {
            this.startGeoTracking();
            this.startBluetoothTracking();
            this.startPushNotification();
        }

        //refresh the patient everytime the app becomes active:
        this.platform.resume.subscribe(() => {
            this.patientService.refreshPatientData();
        })

    }


    public startGeoTracking() {
        if (this.settings.enabled.gps) {
            this.geolocationtrackingService.startBackgroundGeolocation();
        }
    }

    public startBluetoothTracking() {
        if (this.settings.enabled.bluetooth) {
            this.bluetoothTrackingService.startBluetoothTracking();
        }
    }

    public startPushNotification() {
        if (this.settings.enabled.push) {
            this.pushNotificationService.startPushNotifications();
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

    public goToConfirmationRequestLeaveHome() {
        this.closeMenu();

        switch (this.patientService.patient.status) {
            case PatientStatus.UNINFECTED:
                this.router.navigate(['/app/request-leave-home-confirmation-no-test']);
                break;
            case PatientStatus.INFECTION_SUSPECTED:
                this.router.navigate(['/app/request-leave-home-confirmation-mandatory-quarentine']);
                break;
            case PatientStatus.INFECTED:
                this.router.navigate(['/app/request-leave-home-confirmation-infected']);
                break;
        }
    }

    public goToRequestLeaveHome() {
        this.closeMenu();
        this.router.navigate(['/app/request-leave-home']);
    }

    public setAtHome() {
        this.closeMenu();
        this.leaveRequestService.setAtHome();
    }


    public requestTest() {
        this.closeMenu();
        this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
    }

    public goToAutotest() {
        this.closeMenu();
        if (this.settings.autoTestUrl) {
            window.open(this.settings.autoTestUrl, '_system');
        } else {
            this.router.navigate(['/app/autotest/autotest']);
        }
    }

    public goToFollowingUp() {
        this.closeMenu();
        if (this.settings.followingUpUrl) {
            window.open(this.settings.followingUpUrl, '_system');
        } else {
            this.router.navigate(['/app/autotest/following-up/0/seguimiento1_1']);
        }
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

    public goWelcome() {
        this.closeMenu();
        this.router.navigate(['/welcome', 1]);
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

    public uploadContactsAndShowThanksModal() {
        this.closeMenu();
        this.contactTrackerService.uploadContactsAndShowThanksModal();
    }
}

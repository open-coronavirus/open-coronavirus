import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShareService } from '../shared/services/share.service';
import { PatientService } from '../shared/services/patient.service';
import { LeaveRequestService } from '../shared/services/leave-request.service';
import { Subscription } from "rxjs";
import { TestAppointmentService } from "../shared/services/test-appointment.service";
import { PrivacityConditionsService } from '../shared/services/privacity-conditions.service';
import { GeolocationTrackingService } from "../shared/services/tracking/geolocation-tracking.service";
import { BluetoothTrackingService } from "../shared/services/tracking/bluetooth-tracking.service";
import { PermissionsService } from "../shared/services/permissions.service";
import { ContactTrackerService } from '../shared/services/contacts/contact-tracker.service';
import { PushNotificationService } from "../shared/services/push-notification.service";
import { PatientStatus } from "../../../../server/src/common/utils/enums";
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import {TracingService} from "../shared/services/tracing.service";

@Component({
    selector: 'app-container',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnDestroy {

    public leaveStatus: number;
    public patientHasTestAppointment = false;

    public showSendContactInformationMenu = false;
    public contactsCount = null;

    public patientName;
    public patientInitials;
    protected subscriptions: Array<Subscription> = new Array();

    public immuneStatus = PatientStatus.IMMUNE;
    public infectedStatus = PatientStatus.INFECTED;

    constructor(
        protected menu: MenuController,
        protected router: Router,
        @Inject('settings') public settings,
        public patientService: PatientService,
        protected tracingService: TracingService,
        protected geolocationtrackingService: GeolocationTrackingService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected leaveRequestService: LeaveRequestService,
        protected pushNotificationService: PushNotificationService,
        protected testAppointmentService: TestAppointmentService,
        protected permissionsService: PermissionsService,
        protected platform: Platform,
        protected diagnostic: Diagnostic,
        protected privacityConditionsService: PrivacityConditionsService,
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
                if (this.patientService.patient.status == PatientStatus.INFECTED && this.contactsCount > 0) {
                    this.showSendContactInformationMenu = true;
                }
                else {
                    this.showSendContactInformationMenu = false;
                }
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.subscriptions.push(this.contactTrackerService.contactsCount$.subscribe(contactsCount => {
                    this.contactsCount = contactsCount;
                    if (contactsCount > 0 && this.patientService.patient.status == PatientStatus.INFECTED) {
                        this.showSendContactInformationMenu = true;
                    }
                    else {
                        this.showSendContactInformationMenu = false;
                    }
                }));
            }
        }));

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if (loaded) {
                this.patientHasTestAppointment = true;
            }
        }));

        if (this.settings.enabled.gps) {
            this.geolocationtrackingService.startBackgroundGeolocation();
        }
        if (this.settings.enabled.bluetooth) {
            this.bluetoothTrackingService.startBluetoothTracking();
        }
        if (this.settings.enabled.push) {
            this.pushNotificationService.startPushNotifications();
        }

        //refresh the patient everytime the app becomes active:
        this.platform.resume.subscribe(() => {
            this.patientService.refreshPatientData();
        });

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
            case PatientStatus.UNKNOWN:
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

    public checkNewInfectedKeys() {
        this.tracingService.checkNewInfectedKeys();
    }

    public requestTest() {
        if (this.patientService.patient.status === PatientStatus.INFECTED) {
            return;
        }

        this.closeMenu();
        if (this.settings.requestTestUrl) {
            window.open(this.settings.requestTestUrl, '_system');
        } else {
            this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
        }
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

    public showTermsAndConditions(ev) {
        ev.preventDefault();
        this.privacityConditionsService.showTermsAndConditions();
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
        this.tracingService.trackInfectionToServer();
    }
}

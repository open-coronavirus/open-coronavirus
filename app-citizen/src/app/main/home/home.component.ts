import { Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../../shared/services/share.service';
import { PatientService } from '../../shared/services/patient.service';
import { MenuController } from '@ionic/angular';
import { LeaveReasonEnum, LeaveRequestService } from '../../shared/services/leave-request.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { TestAppointmentService } from "../../shared/services/test-appointment.service";
import { Subscription } from "rxjs";
import { AppointmentType } from "../../../../../server/src/common/utils/enums";
import { LeaveRequestWithRelations } from '../../../../../app-health/src/app/shared/sdk/model/leaveRequestWithRelations';
import { LeaveRequest } from 'src/app/shared/sdk';
import {GeolocationTrackingService} from "../../shared/services/tracking/geolocation-tracking.service";
import {BluetoothTrackingService} from "../../shared/services/tracking/bluetooth-tracking.service";
import { ContactTrackerService } from 'src/app/shared/services/contacts/contact-tracker.service';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnDestroy {

    public leaveStatus: number;

    public patientHasTestAppointment = false;

    public document;

    public leaveReason: string;

    public icon;

    public appointmentDescriptionLine1: string;
    public appointmentDescriptionLine2: string;


    protected subscriptions: Array<Subscription> = new Array();

    public patientName: string;
    public leaveRequest: LeaveRequest;

    public serviceAdvertisementUUID;

    constructor(
        protected router: Router,
        public patientService: PatientService,
        protected leaveRequestService: LeaveRequestService,
        protected testAppointmentService: TestAppointmentService,
        protected menu: MenuController,
        @Inject('settings') protected settings,
        protected inAppBrowser: InAppBrowser,
        protected shareService: ShareService,
        protected contactTrackerService: ContactTrackerService
    ) {
        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if (loaded) {
                switch (this.testAppointmentService.testAppointment.type) {
                    case AppointmentType.AT_HOME:
                        this.icon = '/assets/icons/svg/icon-ambulancia.svg';
                        this.appointmentDescriptionLine1 = $localize`:@@appointmentAtHomeDescription:Le enviaremos una ambulancia para hacerle el test del coronavirus en breve`;
                        break;
                    case AppointmentType.AT_HEALTH_CENTER:
                        this.icon = '/assets/icons/svg/icon-cita.svg';
                        let options = { weekday: 'long', month: 'long', day: 'numeric', hour: "2-digit", minute: '2-digit' };
                        let appointmentDate = new Date(this.testAppointmentService.testAppointment.appointmentDate).toLocaleDateString("es-ES", options);
                        let healthCenterAddress = this.testAppointmentService.testAppointment.healthCenter.address;
                        let healthCenterName = this.testAppointmentService.testAppointment.healthCenter.name;
                        let googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + this.testAppointmentService.testAppointment.healthCenter.latitude + ',' + this.testAppointmentService.testAppointment.healthCenter.longitude;

                        let appointmentDescription = $localize`:@@appointmentAtHealthCenterDescription:Cita para el test del coronavirus <strong>[appointmentDate] </strong> en [healthCenterName] [healthCenterAddress]`;
                        this.appointmentDescriptionLine1 = appointmentDescription
                            .replace("\[appointmentDate\]", appointmentDate)
                            .replace("\[healthCenterName\]", healthCenterName)
                            .replace("\[healthCenterAddress\]", healthCenterAddress)
                        let howToGetThereLink = $localize`:@@howToGetThereLink:Como llegar?`;
                        this.appointmentDescriptionLine2 = "<br><a class='appointment__link' href='" + googleMapsUrl + "' target='_syste,'>" + howToGetThereLink + "</a>";
                        break;

                }
                this.patientHasTestAppointment = true;
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(patientLoaded => {
            if (patientLoaded) {
                this.patientName = this.patientService.patient.firstName;
                this.serviceAdvertisementUUID = this.patientService.patient.serviceAdvertisementUUID;
                this.leaveRequestService.loaded$.subscribe(loaded => {
                    if (loaded && this.leaveRequestService.leaveRequest != null) {
                        this.leaveRequest = this.leaveRequestService.leaveRequest;
                        this.leaveStatus = this.leaveRequestService.leaveRequest.status;
                        if (this.leaveRequestService.leaveRequest.leaveReason < LeaveReasonEnum.otherLeaveReason) {
                            this.leaveRequestService.leaveReasons.forEach(leaveReason => {
                                if (leaveReason.id == this.leaveRequestService.leaveRequest.leaveReason) {
                                    this.leaveReason = leaveReason.label;
                                }
                            });
                        } else {
                            this.leaveReason = this.leaveRequestService.leaveRequest.additionalInfo;
                        }
                    }
                });
            }
        }));

    }

    public goToConfirmationRequestLeaveHome() {
        switch (this.patientService.patient?.status) {
            case 1:
                this.router.navigate(['/app/request-leave-home-confirmation-no-test']);
                break;
            case 3:
                this.router.navigate(['/app/request-leave-home-confirmation-mandatory-quarentine']);
                break;
            case 4:
                this.router.navigate(['/app/request-leave-home-confirmation-infected']);
                break;
        }
    }

    public goToRequestLeaveHome() {
        this.router.navigate(['/app/request-leave-home']);
    }

    public setAtHome() {
        this.leaveRequestService.setAtHome();
    }

    public goToAutotest() {
        this.router.navigate(['/app/autotest/autotest']);
    }

    public requestTest() {
        this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
    }

    public goToFollowingUp() {
        this.router.navigate(['/app/autotest/following-up/0/seguimiento1_1']);
    }

    public goToCoronavirusInfo() {
        window.open(this.settings.moreInfoUrl, '_system');
    }

    public share() {
        this.shareService.share();

        // this.router.navigate(['/app/test-result/result/1']); // del 1 al 5
        this.router.navigate(['/app/following-up-result/result/2']);
    }

getTextStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case 4:
                return $localize`:@@statusInfected:Positivo`;

            case 3:
                return $localize`:@@statusQuarantine:Cuarentena obligatoria`;

            case 2:
                return $localize`:@@statusNoInfected:Negativo`;

            default:
                return $localize`:@@statusNoData:No se ha realizado el test de COVID-19`;
        }
    }

getClassStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case 4:
                return 'result--infected';

            case 3:
                return 'result--quarentine';

            case 2:
                return 'result--ok';

        }
    }

getColorStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case 4:
                return '#c80f2eff';

            case 3:
                return '#ffca08ff';

            case 2:
                return '#61bc7cff';

        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    public getSettingsText(): string {
        return this.settings.shareApp.text;
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
            str += hoursMath + ' h ';
        }
        str += min + ' min';
        return str;
    }

    public uploadContactsAndShowThanksModal() {
        this.contactTrackerService.uploadContactsAndShowThanksModal();
    }

    public valeriaDemoConfirmarContact() {
        this.contactTrackerService.showUploadContactRequestModal();
    }
}

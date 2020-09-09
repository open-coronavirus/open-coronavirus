import {ApplicationRef, Component, ElementRef, Inject, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ShareService} from '../../shared/services/share.service';
import {PatientService} from '../../shared/services/patient.service';
import {AlertController, MenuController, Platform} from '@ionic/angular';
import {LeaveReasonEnum, LeaveRequestService} from '../../shared/services/leave-request.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {TestAppointmentService} from "../../shared/services/test-appointment.service";
import {Subscription} from "rxjs";
import {AppointmentType, PatientStatus} from "../../../../../server/src/common/utils/enums";
import {LeaveRequest} from 'src/app/shared/sdk';
import {ContactTrackerService} from 'src/app/shared/services/contacts/contact-tracker.service';
import {TracingService} from "../../shared/services/tracing.service";
import {PermissionsService} from '../../shared/services/permissions.service';
import {BluetoothTrackingService} from "../../shared/services/tracking/bluetooth-tracking.service";
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';
import {KeyManagerService} from "../../shared/services/keys/key-manager.service";

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

    public numItemMenu: number;

    public appointmentDescriptionLine1: string;
    public appointmentDescriptionLine2: string;

    public qrCodeId: string;

    public showSendContactInformationMenu = false;
    public contactsCount = null;

    protected subscriptions: Array<Subscription> = new Array();

    public patientName: string;
    public leaveRequest: LeaveRequest;

    public enabledBluetooth: boolean;

    @ViewChild('footer') footer: ElementRef;

    public STATUS = PatientStatus;

    constructor(
        protected router: Router,
        public patientService: PatientService,
        protected keyManager: KeyManagerService,
        protected leaveRequestService: LeaveRequestService,
        protected testAppointmentService: TestAppointmentService,
        protected bluetoothTrackingService: BluetoothTrackingService,
        protected alertController: AlertController,
        protected tracingService: TracingService,
        protected openNativeSettings: OpenNativeSettings,
        protected menu: MenuController,
        private appRef: ApplicationRef,
        protected platform: Platform,
        @Inject('settings') public settings,
        protected inAppBrowser: InAppBrowser,
        protected shareService: ShareService,
        protected contactTrackerService: ContactTrackerService,
        protected permissionsService: PermissionsService
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
                        let howToGetThereLink = $localize`:@@howToGetThereLink:¿Cómo llegar?`;
                        this.appointmentDescriptionLine2 = "<br><a class='appointment__link' href='" + googleMapsUrl + "' target='_syste,'>" + howToGetThereLink + "</a>";
                        break;

                }
                this.patientHasTestAppointment = true;
            }
        }));

        this.permissionsService.bluetoothPoweredOn$.subscribe(poweredOn => {
            this.enabledBluetooth = poweredOn;
            console.log("[HomeComponent] Changed enabledBluetooth value to " + poweredOn);
            this.appRef.tick();
        });

        this.subscriptions.push(this.patientService.patientDataChanged$.subscribe(patientLoaded => {
            if (patientLoaded) {
                this.patientName = this.patientService.patient.firstName;
                if (this.patientService.patient.status == PatientStatus.INFECTED && !this.tracingService.autoShareActivated()) {
                    this.showSendContactInformationMenu = true;
                }
                else {
                    this.showSendContactInformationMenu = false;
                }
            }
        }));

        this.refreshQrCode();

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                this.subscriptions.push(this.contactTrackerService.contactsCount$.subscribe(contactsCount => {
                    this.contactsCount = contactsCount;
                    if (this.patientService.patient.status == PatientStatus.INFECTED && !this.tracingService.autoShareActivated()) {
                        this.showSendContactInformationMenu = true;
                    }
                    else {
                        this.showSendContactInformationMenu = false;
                    }
                }));
            }
        }));

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

        this.calculateNumItems();

        this.platform.resume.subscribe(() => {
            this.appRef.tick();
            this.qrCodeId = this.keyManager.generateEncryptedKey().encryptedData;
        });

    }

    /**
     * This method refresh the QR code every 5 seconds.
     * It get a new ephiID from the keyManager and set it to
     * the QR code
     *
     */
    public refreshQrCode() {
        this.qrCodeId = this.keyManager.generateEncryptedKey().encryptedData;
        setTimeout(() => {
            this.refreshQrCode();
        }, 5000);
    }

    private calculateNumItems() {
        this.numItemMenu = 0;
        for (const prop in this.settings.home) {
            if (prop.substr(0, 6) === 'module' && this.settings.home[prop] === true) {
                this.numItemMenu++;
            }
        }
    }

    public goToConfirmationRequestLeaveHome() {
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
        this.router.navigate(['/app/request-leave-home']);
    }

    public setAtHome() {
        this.leaveRequestService.setAtHome();
    }

    public requestTest() {
        if (this.patientService.patient.status === PatientStatus.INFECTED) {
            return;
        }

        if (this.settings.requestTestUrl) {
            window.open(this.settings.requestTestUrl, '_system');
        } else {
            this.router.navigate(['/app/test-appointment/at-health-center/confirm']);
        }
    }

    public goToAutotest() {
        if (this.settings.autoTestUrl) {
            window.open(this.settings.autoTestUrl, '_system');
        } else {
            this.router.navigate(['/app/autotest/autotest']);
        }
    }

    public goToFollowingUp() {
        if (this.settings.followingUpUrl) {
            window.open(this.settings.followingUpUrl, '_system');
        } else {
            this.router.navigate(['/app/autotest/following-up/0/seguimiento1_1']);
        }
    }

    public goToCoronavirusInfo() {
        window.open(this.settings.moreInfoUrl, '_system');
    }

    public share() {
        this.shareService.share();
    }

    public getTextStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case PatientStatus.IMMUNE:
                return $localize`:@@statusImune:Inmune`;
            case PatientStatus.INFECTED:
                return $localize`:@@statusInfected:Infección Aguda`;

            case PatientStatus.INFECTION_SUSPECTED:
                return $localize`:@@statusQuarantine:Cuarentena`;

            case PatientStatus.UNINFECTED:
                return $localize`:@@statusNoInfected:Negativo`;

            default:
                return $localize`:@@statusNoData:No se ha realizado el test de COVID-19`;
        }
    }

    public getClassStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case PatientStatus.IMMUNE:
                return 'result--immune';
            case PatientStatus.INFECTED:
                return 'result--infected';
            case PatientStatus.INFECTION_SUSPECTED:
                return 'result--quarentine';
            case PatientStatus.UNINFECTED:
                return 'result--ok';
        }
    }

    public getColorStatus() {
        if (!this.patientService.patient) {
            return;
        }
        switch (this.patientService.patient.status) {
            case PatientStatus.IMMUNE:
                return '#00AAE4ff';
            case PatientStatus.INFECTED:
                return '#c80f2eff';
            case PatientStatus.INFECTION_SUSPECTED:
                return '#ffca08ff';
            case PatientStatus.UNINFECTED:
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

    async clickEnabledBluetooth() {

        let alert = await this.alertController.create({
            header: 'El Bluetooth está desactivado',
            message: 'Para ayudar en la lucha contra el COVID-19 es necesario que active el bluetooth y que la APP tenga permisos para usarlo. Desea revisar la configuración de la APP?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        //nothing to do...
                    }
                },
                {
                    text: 'Si',
                    handler: () => {
                        this.openNativeSettings.open("application_details");
                    }
                }
            ]
        });

        await alert.present();
    }

    public uploadContactsAndShowThanksModal() {
        this.tracingService.trackInfectionToServer();
    }

    public valeriaDemoUploadContactRequestModal() {
        this.tracingService.showUploadContactRequestModal();
    }
}

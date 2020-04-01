import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ShareService} from '../../shared/services/share.service';
import {PatientService} from '../../shared/services/patient.service';
import {MenuController} from '@ionic/angular';
import {LeaveRequestService} from '../../shared/services/leave-request.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {TestAppointmentService} from "../../shared/services/test-appointment.service";
import {Subscription} from "rxjs";
import {AppointmentType} from "../../../../../server/src/common/utils/enums";

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnDestroy {

    public leaveStatus: number;

    public patientHasTestAppointment = false;

    public leaveReason: string;

    public icon;

    public appointmentDescriptionLine1: string;
    public appointmentDescriptionLine2: string;


    protected subscriptions: Array<Subscription> = new Array();

    public patientName: string;

    constructor(protected router: Router,
                public patientService: PatientService,
                protected leaveRequestService: LeaveRequestService,
                protected testAppointmentService: TestAppointmentService,
                protected menu: MenuController,
                protected inAppBrowser: InAppBrowser,
                protected shareService: ShareService) {

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if(loaded) {
                switch(this.testAppointmentService.testAppointment.type) {
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

                        let appointmentDescription = $localize`:@@appointmentAtHealthCenterDescription:Cita para el test del coronavirus [appointmentDate] en [healthCenterName] [healthCenterAddress]`;
                        this.appointmentDescriptionLine1 = appointmentDescription
                            .replace("\[appointmentDate\]", appointmentDate)
                            .replace("\[healthCenterName\]", healthCenterName)
                            .replace("\[healthCenterAddress\]", healthCenterAddress)
                        let howToGetThereLink = $localize`:@@howToGetThereLink:Como llegar?`;
                        this.appointmentDescriptionLine2 = "<a href='" + googleMapsUrl + "' target='_syste,'>" + howToGetThereLink + "</a>";
                        break;

                }
                this.patientHasTestAppointment = true;
            }
        }));

        this.subscriptions.push(this.patientService.patientLoaded$.subscribe(patientLoaded => {
            if(patientLoaded) {
                this.patientName = this.patientService.patient.firstName + " " + this.patientService.patient.lastName;
                this.leaveRequestService.loaded$.subscribe(loaded => {
                    if (loaded && this.leaveRequestService.leaveRequest != null) {
                        this.leaveStatus = this.leaveRequestService.leaveRequest.status;
                        if (this.leaveRequestService.leaveRequest.leaveReason < 9) {
                            this.leaveRequestService.leaveReasons.forEach(leaveReason => {
                                if (leaveReason.id == this.leaveRequestService.leaveRequest.leaveReason) {
                                    this.leaveReason = leaveReason.label;
                                }
                            });
                        } else {
                            this.leaveReason = this.leaveRequestService.leaveRequest.additionalInfo;
                        }
                    }
                })
            }
        }));

    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

    public goToRequestLeaveHome() {
        this.router.navigate(['/app/request-leave-home'])
    }

    public setAtHome() {
        this.leaveRequestService.setAtHome();
    }

    public goToAutotest() {
        this.router.navigate(['/app/autotest'])
    }

    public goToCoronavirusInfo() {
        window.open("https://coronavirus.epidemixs.org/#/opening", '_system');
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

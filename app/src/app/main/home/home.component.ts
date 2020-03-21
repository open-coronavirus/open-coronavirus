import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ShareService} from '../../shared/services/share.service';
import {PatientService} from '../../shared/services/patient.service';
import {MenuController} from '@ionic/angular';
import {LeaveRequestService} from '../../shared/services/leave-request.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

    public leaveStatus: number;

    public leaveReason: string;

    public patientName: string;

    constructor(protected router: Router,
                public patientService: PatientService,
                protected leaveRequestService: LeaveRequestService,
                protected menu: MenuController,
                protected inAppBrowser: InAppBrowser,
                protected shareService: ShareService) {

        this.patientService.patientLoaded$.subscribe(patientLoaded => {
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
        });

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

}

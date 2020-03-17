import {Component, ViewEncapsulation} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {ShareService} from '../shared/services/share.service';
import {PatientService} from '../shared/services/patient.service';
import {LeaveRequestService} from '../shared/services/leave-request.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-container',
    templateUrl: 'app-container.component.html',
    styleUrls: ['app-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppContainerComponent {

    public leaveStatus: number;

    public patientName;

    constructor(protected menu: MenuController,
                protected router: Router,
                protected patientService: PatientService,
                protected leaveRequestService: LeaveRequestService,
                protected iab: InAppBrowser,
                protected shareService: ShareService) {

        this.leaveRequestService.loaded$.subscribe(loaded => {
            if(loaded && this.leaveRequestService.leaveRequest != null) {
                this.leaveStatus = this.leaveRequestService.leaveRequest.status;
            }
        })

        this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {
                this.patientName = this.patientService.patient.firstName + " " + this.patientService.patient.lastName;
            }
        })

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


}

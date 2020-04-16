import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {LeaveRequestService} from '../../shared/services/leave-request.service';
import {Router} from '@angular/router';

@Component({
    selector: 'request-leave-home',
    templateUrl: 'request-leave-home.component.html',
    styleUrls: ['request-leave-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RequestLeaveHomeComponent {

    constructor(
        public leaveRequestService: LeaveRequestService,
        protected router: Router,
        @Inject('settings') protected settings,
    ) {

    }

    public requestLeaveHome(ev, value) {
        if (!ev) {
            return;
        }

        if (value < 8) {
            if (this.settings.screens.selfDeclarationLeave) {
                this.router.navigate(['/app/self-declaration-leave', value]);
            } else {
                this.leaveRequestService.request(value, null).subscribe(result => {
                    if (result != null) {
                        this.router.navigate(['/app/leave-request-result']);
                    }
                });
            }
        } else {
            this.router.navigate(['/app/leave-custom-reason-form', value]);
        }
    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

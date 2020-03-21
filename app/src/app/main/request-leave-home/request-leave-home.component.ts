import {Component, ViewEncapsulation} from '@angular/core';
import {LeaveRequestService} from '../../shared/services/leave-request.service';
import {Router} from '@angular/router';

@Component({
    selector: 'request-leave-home',
    templateUrl: 'request-leave-home.component.html',
    styleUrls: ['request-leave-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RequestLeaveHomeComponent {

    constructor(public leaveRequestService: LeaveRequestService,
                protected router: Router) {

    }

    public requestLeaveHome(value) {

        if(value < 9) {
            this.leaveRequestService.request(value, null).subscribe(result => {
                if(result != null) {
                    this.router.navigate(['/app/leave-request-result']);
                }
            })
        }
        else {
            this.router.navigate(['/app/leave-custom-reason-form']);
        }

    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

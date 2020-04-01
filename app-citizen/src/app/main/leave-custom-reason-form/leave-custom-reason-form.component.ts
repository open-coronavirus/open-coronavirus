import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {LeaveRequestService} from '../../shared/services/leave-request.service';

@Component({
    selector: 'leave-custom-reason-form',
    templateUrl: 'leave-custom-reason-form.component.html',
    styleUrls: ['leave-custom-reason-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LeaveCustomReasonFormComponent {

    public leaveRequestAdditionalInfo;

    constructor(protected router: Router,
                protected leaveRequestService: LeaveRequestService) {
    }

    public backToRequestReasons() {
        this.router.navigate(['app/request-leave-home']);
    }

    public backToHome() {
        this.router.navigate(['app/home']);
    }

    public requestLeaveHome() {
        if(this.leaveRequestAdditionalInfo != null && this.leaveRequestAdditionalInfo.length > 3) {
            this.leaveRequestService.request(9, this.leaveRequestAdditionalInfo).subscribe(result => {
                if (result != null) {
                    this.router.navigate(['/app/leave-request-result']);
                }
            })
        }
        else {
            let enterCustomReasonToLeaveTo = $localize`:@@enterCustomReasonToLeaveTo:Por favor, escriba porque desea salir.`;
            alert(enterCustomReasonToLeaveTo);
        }
    }

}

import {Component, ViewEncapsulation} from '@angular/core';
import {LeaveRequestService, LeaveReasonEnum} from '../../shared/services/leave-request.service';
import {Router} from '@angular/router';

@Component({
    selector: 'leave-request-result',
    templateUrl: 'leave-request-result.component.html',
    styleUrls: ['leave-request-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LeaveRequestResultComponent {

    public leaveRequestReason: any;

    constructor(protected leaveRequestService: LeaveRequestService,
                protected router: Router) {
        this.leaveRequestService.loaded$.subscribe(loaded => {
            if (loaded) {
                this.leaveRequestService.leaveReasons.forEach(leaveReason => {
                    if (leaveReason.id === this.leaveRequestService.leaveRequest.leaveReason) {
                        if (leaveReason.id !== LeaveReasonEnum.otherLeaveReason) {
                            this.leaveRequestReason = leaveReason;
                            this.leaveRequestReason.additionalInfo = this.leaveRequestService.leaveRequest.additionalInfo;
                        } else {
                            this.leaveRequestReason = {
                                id: LeaveReasonEnum.otherLeaveReason,
                                label: this.leaveRequestService.leaveRequest.additionalInfo
                            };
                        }
                    }
                });
            }
        });
    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

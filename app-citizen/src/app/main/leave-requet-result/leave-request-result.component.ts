import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {PatientService} from '../../shared/services/patient.service';
import {PatientInfoFormComponent} from '../../shared/patient-info-form/patient-info-form.component';
import {LeaveRequestService, LeaveReasonEnum} from '../../shared/services/leave-request.service';
import {Router} from '@angular/router';
import {LeaveRequestWithRelations} from '../../shared/sdk';

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
            if(loaded) {
                if(this.leaveRequestService.leaveRequest.leaveReason < LeaveReasonEnum.otherLeaveReason) {
                    this.leaveRequestService.leaveReasons.forEach(leaveReason => {
                        if(leaveReason.id == this.leaveRequestService.leaveRequest.leaveReason) {
                            this.leaveRequestReason = leaveReason;
                        }
                    });
                }
                else {
                    this.leaveRequestReason = {
                        id: LeaveReasonEnum.otherLeaveReason,
                        label: this.leaveRequestService.leaveRequest.additionalInfo
                    }
                }
            }
        })
    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

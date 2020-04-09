import {Component, ViewEncapsulation, Inject} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LeaveRequestService} from '../../shared/services/leave-request.service';

@Component({
    selector: 'leave-custom-reason-form',
    templateUrl: 'leave-custom-reason-form.component.html',
    styleUrls: ['leave-custom-reason-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LeaveCustomReasonFormComponent {

    public leaveRequestAdditionalInfo;
    public leaveReason: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected router: Router,
        protected leaveRequestService: LeaveRequestService,
        @Inject('settings') protected settings
    ) {
        this.activatedRoute.paramMap.subscribe(params => {
            this.leaveReason = +params.get('leaveReason');
        });
    }

    public backToRequestReasons() {
        this.router.navigate(['app/request-leave-home']);
    }

    public backToHome() {
        this.router.navigate(['app/home']);
    }

    public requestLeaveHome() {
        if (this.leaveRequestAdditionalInfo != null && this.leaveRequestAdditionalInfo.length > 3) {
            if (this.settings.screens.selfDeclarationLeave) {
                this.router.navigate([
                    '/app/self-declaration-leave',
                    this.leaveReason,
                    {
                        leaveRequestAdditionalInfo: this.leaveRequestAdditionalInfo
                    }
                ]);
            } else {
                this.leaveRequestService.request(this.leaveReason, this.leaveRequestAdditionalInfo).subscribe(result => {
                    if (result != null) {
                        this.router.navigate(['/app/leave-request-result']);
                    }
                });
            }
        } else {
            const enterCustomReasonToLeaveTo = $localize`:@@enterCustomReasonToLeaveTo:Por favor, escriba porque desea salir.`;
            alert(enterCustomReasonToLeaveTo);
        }
    }

}

import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LeaveRequestService, LeaveReasonEnum } from '../../shared/services/leave-request.service';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'leave-custom-reason-form',
    templateUrl: 'leave-custom-reason-form.component.html',
    styleUrls: ['leave-custom-reason-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LeaveCustomReasonFormComponent {

    public leaveRequestAdditionalInfo;
    public leaveReason: number;
    public leaveRequestReason: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected router: Router,
        protected alertController: AlertController,
        protected leaveRequestService: LeaveRequestService,
        @Inject('settings') protected settings
    ) {
        this.activatedRoute.paramMap.subscribe(params => {
            this.leaveReason = +params.get('leaveReason');

            this.leaveRequestService.loaded$.subscribe(loaded => {
                if (loaded) {
                    this.leaveRequestService.leaveReasons.forEach(leaveReason => {
                        if (leaveReason.id === this.leaveReason && leaveReason.id !== LeaveReasonEnum.otherLeaveReason) {
                            this.leaveRequestReason = leaveReason;
                        }
                    });
                }
            });
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
            // alert(enterCustomReasonToLeaveTo);
            this.showAlert(enterCustomReasonToLeaveTo);
        }
    }


    public async showAlert(msg: string) {
        const alert = await this.alertController.create({
            message: msg,
            buttons: [
                {
                    text: $localize`:@@responseAccept:Aceptar`,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (res) => {
                    }
                },
            ]
        });
        await alert.present();
    }

}

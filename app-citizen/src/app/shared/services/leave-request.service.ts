import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {PatientService} from './patient.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {LeaveRequest, LeaveRequestControllerService} from '../sdk';
import {AlertController} from '@ionic/angular';
import {leaveReasonsEN, leaveReasonsES} from "./leavereasons";

@Injectable()
export class LeaveRequestService {

    public leaveRequest: LeaveRequest = null;

    public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public leaveReasons: Array<any>;


    constructor(protected patientService: PatientService,
                @Inject(LOCALE_ID) locale: string,
                public alertController: AlertController,
                protected leaveRequestController: LeaveRequestControllerService
    ) {

        switch(locale) {
            case 'es':
                this.leaveReasons = leaveReasonsES;
                break;
            case 'en':
            default:
                this.leaveReasons = leaveReasonsEN;
                break;

        }

        this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {

                this.leaveRequestController.leaveRequestControllerFindByToken(patientService.patient.id).subscribe(existingLeaveRequest => {

                    if(existingLeaveRequest.length > 0) {
                        this.leaveRequest = existingLeaveRequest[0];
                    }
                    this.loaded$.next(true);

                });

            }
        })

    }

    public request(leaveReason: number, additionalInfo: string) {

        let returnValue = new Subject();

        if(additionalInfo == null) {
            additionalInfo = "";
        }

        let request: LeaveRequest = new class implements LeaveRequest {
            [key: string]: object | any;

            additionalInfo: string;
            backToHomeTimestamp: Date;
            id: string;
            leaveReason: number;
            outOfHomeTimestamp: Date;
            patientId: string;
            status: number;
        }

        request.leaveReason = leaveReason;
        request.additionalInfo = additionalInfo;
        request.patientId = this.patientService.patient.id;

        this.leaveRequestController.leaveRequestControllerCreate(request).subscribe(createdRequest => {
            this.leaveRequestController.leaveRequestControllerFindByToken(this.patientService.patient.id).subscribe(existingLeaveRequest => {
                if(existingLeaveRequest.length > 0) {
                    this.leaveRequest = existingLeaveRequest[0];
                    returnValue.next(createdRequest);
                }
                this.loaded$.next(true);
            });
        });

        return returnValue;

    }

    async setAtHome() {
        const alert = await this.alertController.create({
            message: 'Ya ha llegado a casa?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Si',
                    handler: () => {
                        if(this.leaveRequest != null) {
                            this.leaveRequestController.leaveRequestControllerSetAtHome(this.patientService.patient.id).subscribe(result => {
                                this.leaveRequestController.leaveRequestControllerFindByToken(this.patientService.patient.id).subscribe(existingLeaveRequest => {
                                    if(existingLeaveRequest.length > 0) {
                                        this.leaveRequest = existingLeaveRequest[0];
                                    }
                                    this.loaded$.next(true);
                                });
                            });
                        }

                    }
                }
            ]
        });
        await alert.present();
    }


}

import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {PatientService} from './patient.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {LeaveRequest, LeaveRequestControllerService} from '../sdk';
import {AlertController} from '@ionic/angular';

@Injectable()
export class LeaveRequestService {

    public leaveRequest: LeaveRequest = null;

    public loaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public leaveReasons = [
        {
            id: 1,
            label: $localize`:@@groceryShoppingLeaveReason:Comprar alimentos`,
            icon: "icon-salir-comida.svg"
        },
        {
            id: 2,
            label: $localize`:@@drugstoreShoppingLeaveReason:Comprar productos farmacéuticos y de primera necesidad`,
            icon: "icon-salir-medicamentos.svg"
        },
        {
            id: 3,
            label: $localize`:@@forMedicalAssitanceLeaveReason:Ir al médico o al hospital`,
            icon: "icon-hospital.svg"
        },
        {
            id: 4,
            label: $localize`:@@goToWorkLeaveReason:Ir al trabajo`,
            icon: "icon-salir-trabajo.svg"
        },
        {
            id: 5,
            label: $localize`:@@backToHomeLeaveReason:Volver a casa`,
            icon: "icon-volver-casa.svg"
        },
        {
            id: 6,
            label: $localize`:@@assistElderlyPersonLeaveReason:Asistir a un mayor u otra persona dependiente`,
            icon: "icon-salir-asistencia.svg"
        },
        {
            id: 7,
            label: $localize`:@@goToBankLeaveReason:Ir al banco`,
            icon: "icon-salir-dinero.svg"
        },
        {
            id: 8,
            label: $localize`:@@eventsOfForceMajeureLeaveReason:Por causa de fuerza mayor o situación de necesidad`,
            icon: "icon-salir-fuerza.svg"
        },
        {
            id: 9999,
            label: $localize`:@@otherLeaveReason:Otro motivo`
        }
    ];


    constructor(protected patientService: PatientService,
                @Inject(LOCALE_ID) locale: string,
                public alertController: AlertController,
                protected leaveRequestController: LeaveRequestControllerService
    ) {

        this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {

                this.leaveRequestController.leaveRequestControllerFindByToken(patientService.patient.id).subscribe(existingLeaveRequest => {

                    if(existingLeaveRequest != null) {
                        this.leaveRequest = existingLeaveRequest;
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
                if(existingLeaveRequest != null) {
                    this.leaveRequest = existingLeaveRequest;
                    returnValue.next(createdRequest);
                }
                this.loaded$.next(true);
            });
        });

        return returnValue;

    }

    async setAtHome() {
        const alert = await this.alertController.create({
            message: 'Did you already arrive home?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        if(this.leaveRequest != null) {
                            this.leaveRequestController.leaveRequestControllerSetAtHome(this.patientService.patient.id).subscribe(result => {
                                this.leaveRequestController.leaveRequestControllerFindByToken(this.patientService.patient.id).subscribe(existingLeaveRequest => {
                                    if(existingLeaveRequest != null) {
                                        this.leaveRequest = existingLeaveRequest;
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

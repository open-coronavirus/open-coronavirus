import {Injectable} from "@angular/core";
import {TestAppointmentControllerService, TestAppointmentWithRelations} from "../sdk";
import {PatientService} from "./patient.service";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable()
export class TestAppointmentService {

    public testAppointment: TestAppointmentWithRelations;

    public testAppointmentLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    public constructor(protected patientService: PatientService,
                       protected testAppointmentControllerService: TestAppointmentControllerService) {

        //first of all
        this.loadTestAppointment();

    }

    public loadTestAppointment() {

        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {

                this.testAppointmentControllerService.testAppointmentControllerFindLatestByPatientId(this.patientService.patient.id).subscribe(testAppointment => {
                    if(testAppointment != null) {
                        this.testAppointment = testAppointment;
                        this.testAppointmentLoaded$.next(true);
                    }
                })

            }
        });
    }

    public requestTestAppointment() {

        let returnValue = new Subject();

        this.patientService.patientLoaded$.subscribe(loaded => {
            if (loaded) {
                let testAppointment: TestAppointmentWithRelations = new class implements TestAppointmentWithRelations {
                    [key: string]: object | any;

                    date: Date;
                    healthCenterId: string;
                    id: string;
                    patientId: string;
                    type: number;
                }

                testAppointment.patientId = this.patientService.patient.id;

                this.testAppointmentControllerService.testAppointmentControllerCreate(testAppointment).subscribe(testAppointmentResult => {
                    if(testAppointmentResult != null) {
                        this.loadTestAppointment();
                        returnValue.next(true);
                    }
                })

            }
        });

        return returnValue;

    }

}

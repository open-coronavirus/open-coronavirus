import {Component, ViewEncapsulation} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TestAppointmentService} from "../../../shared/services/test-appointment.service";
import {Location} from "@angular/common";
import {TestAppointmentWithRelations} from "../../../shared/sdk";
import {PatientService} from "../../../shared/services/patient.service";
import {TestResultService} from "../../../shared/services/test-result.service";

@Component({
    selector: 'appointment-at-home',
    templateUrl: 'appointment-at-home.component.html',
    styleUrls: ['appointment-at-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppointmentAtHomeComponent {

    protected subscriptions: Array<Subscription> = new Array();
    protected appointmentType: string;

    protected testAppointment: TestAppointmentWithRelations;
    public patientAddress: string;
    protected appointmentDate: string;

    constructor(protected activatedRoute: ActivatedRoute,
                protected patientService: PatientService,
                protected testResultService: TestResultService,
                protected testAppointmentService: TestAppointmentService,
                protected location: Location,
                protected router: Router) {

        this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if(loaded) {
                let options = { weekday: 'long', month: 'long', day: 'numeric', hour: "2-digit", minute: '2-digit' };
                this.testAppointment = this.testAppointmentService.testAppointment;
                this.appointmentDate = new Date(this.testAppointmentService.testAppointment.appointmentDate).toLocaleDateString("es-ES", options);
            }
        });

        this.subscriptions.push(this.patientService.patientDataChanged$.subscribe(loaded => {
            if(loaded) {
                this.patientAddress = this.patientService.patient.street + (this.patientService.patient.apartment!=null?(' ' + this.patientService.patient.apartment):'') + ' (' + this.patientService.patient.postalCode + ')';
            }
        }));

    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

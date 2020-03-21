import {Component, ViewEncapsulation} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TestAppointmentService} from "../../../shared/services/test-appointment.service";
import {Location} from "@angular/common";
import {TestAppointmentWithRelations} from "../../../shared/sdk";
import {PatientService} from "../../../shared/services/patient.service";
import {AppointmentType} from "../../../../../../server/src/common/utils/enums";

@Component({
    selector: 'schedule-test-appointment',
    templateUrl: 'test-appointment-result.component.html',
    styleUrls: ['test-appointment-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TestAppointmentResultComponent {

    protected subscriptions: Array<Subscription> = new Array();
    protected appointmentType: string;

    protected showAppointmentAtHome = false;
    protected showAppointmentAtHealthCenter = false;
    protected testAppointment: TestAppointmentWithRelations;
    protected patientAddress: string;
    protected appointmentDate: string;
    protected healthCenterAddress: string;

    constructor(protected activatedRoute: ActivatedRoute,
                protected patientService: PatientService,
                protected testAppointmentService: TestAppointmentService,
                protected location: Location,
                protected router: Router) {

        this.subscriptions.push(this.activatedRoute.params.subscribe(params => {
            this.appointmentType = params['appointment-type'];

            this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
                if(loaded) {
                    let options = { weekday: 'long', month: 'long', day: 'numeric', hour: "2-digit", minute: '2-digit' };
                    this.testAppointment = this.testAppointmentService.testAppointment;
                    this.appointmentDate = new Date(this.testAppointmentService.testAppointment.date).toLocaleDateString("es-ES", options);
                    if(!!this.testAppointmentService.testAppointment.healthCenter) {
                        this.healthCenterAddress = this.testAppointmentService.testAppointment.healthCenter.address;
                    }

                    if(this.testAppointment.type == AppointmentType.AT_HEALTH_CENTER) {
                        this.showAppointmentAtHealthCenter = true;
                    }
                    else {
                        this.showAppointmentAtHome = true;
                    }


                }
            });

            this.patientService.patientLoaded$.subscribe(loaded => {
                if(loaded) {
                    this.patientAddress = this.patientService.patient.street + (this.patientService.patient.apartment!=null?(' ' + this.patientService.patient.apartment):'') + ' (' + this.patientService.patient.postalCode + ')';
                }
            })


        }));

    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

}

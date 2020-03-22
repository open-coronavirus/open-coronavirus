import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {TestAppointmentService} from "../../../shared/services/test-appointment.service";
import {Location} from "@angular/common";
import {TestAppointmentWithRelations} from "../../../shared/sdk";
import {PatientService} from "../../../shared/services/patient.service";
import {AppointmentType, TestResultEnum} from "../../../../../../server/src/common/utils/enums";
import {TestResultService} from "../../../shared/services/test-result.service";

import * as L from 'leaflet';

@Component({
    selector: 'appointment-health-center',
    templateUrl: 'appointment-health-center.component.html',
    styleUrls: ['appointment-health-center.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppointmentHealthCenterComponent implements AfterViewInit, OnDestroy {

    protected map;

    protected subscriptions: Array<Subscription> = new Array();

    protected testAppointment: TestAppointmentWithRelations;
    protected appointmentDate: string;
    public healthCenterAddress: string;
    public healthCenterName: string;

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
                this.appointmentDate = new Date(this.testAppointmentService.testAppointment.date).toLocaleDateString("es-ES", options);
                if(!!this.testAppointmentService.testAppointment.healthCenter) {
                    this.healthCenterAddress = this.testAppointmentService.testAppointment.healthCenter.address;
                    this.healthCenterName = this.testAppointmentService.testAppointment.healthCenter.name;
                }
            }
        });

    }

    ngAfterViewInit(): void {

        this.subscriptions.push(this.testAppointmentService.testAppointmentLoaded$.subscribe(loaded => {
            if(loaded) {
                setTimeout(() => {
                    this.map = L.map('map').setView([this.testAppointmentService.testAppointment.healthCenter.latitude, this.testAppointmentService.testAppointment.healthCenter.longitude], 15);
                    console.log([this.testAppointmentService.testAppointment.healthCenter.latitude, this.testAppointmentService.testAppointment.healthCenter.longitude]);

                    L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
                        maxZoom: 20,
                        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                    }).addTo(this.map);
                });
            }

        }));

    }

    public showDirectionsToHealthCenter() {
        let url = 'https://www.google.com/maps/dir/?api=1&destination=' + this.testAppointmentService.testAppointment.healthCenter.latitude + ',' + this.testAppointmentService.testAppointment.healthCenter.longitude;
        window.open(url, '_system');
    }

    public backToHome() {
        this.router.navigate(['/app/home']);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        })
    }

}

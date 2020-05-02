import {Component, ViewEncapsulation, Inject, ApplicationRef} from '@angular/core';
import { Location } from '@angular/common';
import {PatientService} from "../../shared/services/patient.service";
import {ContactTrackerService} from "../../shared/services/contacts/contact-tracker.service";



@Component({
    selector: 'about',
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent {

    public version;
    public traceUUID;
    public nearestDevices;
    public showMyUUID;
    public showNearestDevicesUUID;

    constructor(
        protected location: Location,
        protected patientService: PatientService,
        private appRef: ApplicationRef,
        public contactTrackerService: ContactTrackerService,
        @Inject('settings') protected settings
    ) {

        if(!!this.settings.debug) {
            this.showMyUUID = this.settings.debug.showMyUUID;
            this.showNearestDevicesUUID = this.settings.debug.showNearestDevicesUUID;
        }

        this.version = this.settings.appVersion;

        this.contactTrackerService.contactAddedOrUpdated$.subscribe(event => {
            if(event) {
                let nearestDevices = [];
                for (let value of this.contactTrackerService.nearestDevices.values()) {
                    nearestDevices.push(value);
                }
                this.nearestDevices = nearestDevices;
                this.appRef.tick(); //ensure refresh
            }
        })


    }


    public goBack() {
        this.location.back();
    }

    public getNumberVersionText(): string {
        return this.settings.appVersion;
    }


}

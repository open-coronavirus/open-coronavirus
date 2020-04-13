import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";




@Component({
    selector: 'appointment-appointment',
    templateUrl: 'appointment-appointment.component.html',
    styleUrls: ['appointment-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppointmentAppointmentComponent {


    constructor(
        protected router: Router) {



    }


    public backToHome() {
        this.router.navigate(['/app/home']);
    }



}

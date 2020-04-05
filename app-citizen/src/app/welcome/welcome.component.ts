import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from '../shared/services/patient.service';


@Component({
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

    constructor(
        protected router: Router,
        protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {


    }

    public goToRegister() {
        // this.router.navigate(['register']);
    }

}

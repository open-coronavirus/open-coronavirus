import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {PatientService} from '../shared/services/patient.service';


@Component({
    selector: 'splash',
    templateUrl: 'splash.component.html',
    styleUrls: ['splash.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit {

    constructor(protected router: Router,
                protected patientService: PatientService,
                protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {

        this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {
                this.router.navigate(['app/home']);
            }
        });

    }

    public goToRegister() {
        this.router.navigate(['register']);
    }

}

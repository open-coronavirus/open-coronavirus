import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from '../shared/services/patient.service';
import { IonSlides } from '@ionic/angular';


@Component({
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

    @ViewChild(IonSlides) slidesElement: IonSlides;

    lastSlide: boolean;

    slideOpts: any;
    constructor(
        protected router: Router,
        protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {
        this.nativeStorage.setItem('WELCOME_VISIT', true).then(result => { });
        this.slideOpts = {
            initialSlide: 0,
            speed: 400
        };
    }

    onChangeSlide(ev) {
        this.slidesElement.getActiveIndex().then(index => {
            this.slidesElement.length().then(len => {
                this.lastSlide = index === len - 1;
            });
        });
    }

    goContinue() {
        this.slidesElement.getActiveIndex().then(index => {
            this.slidesElement.length().then(len => {
                if (index < len - 1) {
                    this.slidesElement.slideNext();
                } else {
                    this.goToRegister();
                }
            });
        });

    }

    public goToRegister() {
        this.router.navigate(['register']);
    }

}

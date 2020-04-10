import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { PatientService } from '../shared/services/patient.service';
import { IonSlides } from '@ionic/angular';
import {StorageService} from "../shared/services/storage.service";


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
        protected storageService: StorageService) {
    }

    public ngOnInit(): void {

        this.storageService.setItem('WELCOME_VISIT', true);
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

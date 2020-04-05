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

    TOTAL_SLIDES = 3;

    slideOpts: any;
    constructor(
        protected router: Router,
        protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {

        this.slideOpts = {
            initialSlide: 0,
            speed: 400
        };

    }

    goContinue() {
        // console.log("his.slidesElement.pager: ", this.slidesElement.pager);
        // if (this.slidesElement.length < this.TOTAL_SLIDES) {
        //     this.slidesElement.slideNext();
        // } else {
        //     this.goToSplash();
        // }
        this.goContinue();

    }

    public goToSplash() {
        this.router.navigate(['splash']);
    }

}

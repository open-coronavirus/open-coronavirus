import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { StorageService } from "../shared/services/storage.service";


@Component({
    selector: 'welcome',
    templateUrl: 'welcome.component.html',
    styleUrls: ['welcome.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

    @ViewChild(IonSlides) slidesElement: IonSlides;

    lastSlide: boolean;
    goHome: boolean;
    didInit: boolean;

    slideOpts: any;
    constructor(
        protected router: Router,
        private activatedRoute: ActivatedRoute,
        protected storageService: StorageService) {

        this.activatedRoute.paramMap.subscribe(params => {
            this.goHome = +params.get('goHome') === 1;
        });
    }

    public ngOnInit(): void {
        this.didInit = false;

        this.storageService.setItem('WELCOME_VISIT', true);
        this.slideOpts = {
            initialSlide: 0,
            speed: 400
        };

    }

    public ionViewWillEnter() {
        this.didInit = true;
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
                    if (this.goHome) {
                        this.goToHome();
                    } else {
                        this.goToRegister();
                    }

                }
            });
        });
    }

    public goToHome() {
        this.router.navigate(['app/home']);
    }

    public goToRegister() {
        this.router.navigate(['register']);
    }



}

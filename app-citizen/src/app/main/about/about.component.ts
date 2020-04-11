import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { Location } from '@angular/common';



@Component({
    selector: 'about',
    templateUrl: 'about.component.html',
    styleUrls: ['about.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AboutComponent {



    constructor(
        protected location: Location,
        @Inject('settings') protected settings
    ) {

    }


    public goBack() {
        this.location.back();
    }

    public getNumberVersionText(): string {
        return this.settings.appVersion;
    }


}

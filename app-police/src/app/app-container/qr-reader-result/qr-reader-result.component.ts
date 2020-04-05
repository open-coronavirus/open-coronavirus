import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../shared/services/user.service';


@Component({
    selector: 'qr-reader-result',
    templateUrl: 'qr-reader-result.component.html',
    styleUrls: ['qr-reader-result.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QrReaderResultComponent {

    constructor(public userService: UserService,
                protected location: Location) { }


    public goBack() {
        this.location.back();
    }

}

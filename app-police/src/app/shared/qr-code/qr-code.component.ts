import {Component} from '@angular/core';
import { UserService } from '../services/user.service';


@Component({
    selector: 'qr-code',
    templateUrl: 'qr-code.component.html',
    styleUrls: ['qr-code.component.scss']
})
export class QrCodeComponent {

    public url = null;

    constructor(protected userService: UserService) {
        // this.url = userService.getCheckStatusUrl();
    }


}

import {Injectable} from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable()
export class ShareService {

    constructor(private socialSharing: SocialSharing) {
    }

    public share() {
        this.socialSharing.share('Estoy usando Open Coronavirus, una app para luchar contra el coronavirus', null, 'https://open-coronavirus.com')
    }

}

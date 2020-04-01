import {Injectable} from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable()
export class ShareService {

    constructor(private socialSharing: SocialSharing) {
    }

    public share() {
        this.socialSharing.share($localize`:@@shareText:Estoy usando Open Coronavirus, una APP para combatir la propagación de infecciones`, null, 'https://open-coronavirus.com')
    }

}

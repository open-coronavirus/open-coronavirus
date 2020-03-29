import {Injectable} from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Injectable()
export class ShareService {

    constructor(private socialSharing: SocialSharing) {
    }

    public share() {
        this.socialSharing.share('I\'m using an app to help fighting the CORONAVIRUS. You can download it at http://example-app.com', null, 'https://open-coronavirus.com')
    }

}

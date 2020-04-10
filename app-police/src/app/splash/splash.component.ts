import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UserService } from '../shared/services/user.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'splash',
    templateUrl: 'splash.component.html',
    styleUrls: ['splash.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit {

    constructor(
        protected userService: UserService,
        private navCtrl: NavController,
        protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {
        // Code auto-enter login
        // this.userService.userLoaded$.subscribe(loaded => {
        //     if (loaded) {
        //         this.router.navigate(['app/qr-reader']);
        //     }
        // });
    }

    public enter() {
        this.navCtrl.navigateRoot(['login']);
    }

}

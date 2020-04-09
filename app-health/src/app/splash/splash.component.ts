import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UserService } from '../shared/services/user.service';


@Component({
    selector: 'splash',
    templateUrl: 'splash.component.html',
    styleUrls: ['splash.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SplashComponent implements OnInit {

    constructor(
        protected router: Router,
        protected userService: UserService,
        protected nativeStorage: NativeStorage) {
    }

    public ngOnInit(): void {
        // Code auto-enter login
        // this.userService.userLoaded$.subscribe(loaded => {
        //     if (loaded) {
        //         this.router.navigate(['app/diagnostic-send']);
        //     }
        // });
    }

    public enter() {
        // this.router.navigate(['app/diagnostic-send']);
        this.router.navigate(['login']);
    }

}

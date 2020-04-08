import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserControllerService } from '../sdk/api/userController.service';
import { AuthControllerService } from '../sdk/api/authController.service';
import { PoliceOfficerLogin } from '../sdk/model/policeOfficerLogin';
import { PoliceOfficerControllerService } from '../sdk/api/policeOfficerController.service';
import { PoliceOfficerWithRelations } from '../sdk/model/policeOfficerWithRelations';


@Injectable()
export class UserService {

    get user(): PoliceOfficerWithRelations {
        return this._user;
    }

    set user(value: PoliceOfficerWithRelations) {
        this._user = value;
    }

    protected userToken: string = null;
    private _user: PoliceOfficerWithRelations = null;

    public userLoaded$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    public static USER_TOKEN_KEY = 'userToken';

    constructor(
        protected authController: AuthControllerService,
        protected policeController: PoliceOfficerControllerService,
        protected userController: UserControllerService,
        @Inject('environment') protected environment,
        protected router: Router,
        public platform: Platform,
        protected nativeStorage: NativeStorage) {

        platform.ready().then(() => {
            if (this.environment.production) {
                this.nativeStorage.getItem(UserService.USER_TOKEN_KEY)
                    .then(
                        data => {
                            this.loadUser(data);
                        }
                    );
            } else {
                this.loadUser('1');
            }
        });

    }

    protected loadUser(userToken) {
        this.setUserToken(userToken).subscribe(success => {
            if (success) {
                this.userLoaded$.next(true);
            } else {
                this.router.navigate(['/login']);
            }
        });
    }

    public setUserToken(userToken: string) {
        let returnValue = new Subject();
        this.policeController.policeOfficerControllerFindById(userToken).subscribe(user => {
            if (user != null) {
                this._user = user;
                this.userToken = userToken;
                returnValue.next(true);
            } else {
                returnValue.next(false);
            }

        });

        return returnValue;
    }

    public login(userCredentials: PoliceOfficerLogin): Subscribable<any> {
        let returnValue = new Subject();
        this.authController.authControllerPoliceOfficerLogin({ uniqueId: userCredentials.uniqueId, password: userCredentials.password }).subscribe(res => {
            if (res) {
                this.loadUser(res.id);
                this.nativeStorage.setItem(UserService.USER_TOKEN_KEY, res.id).then(result => { });
                returnValue.next(res);
            } else {
                returnValue.next(false);
            }
        }, err => {
            returnValue.next(false);
        });

        return returnValue;

    }

}

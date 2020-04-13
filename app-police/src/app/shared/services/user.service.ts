import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscribable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { UserControllerService } from '../sdk/api/userController.service';
import { PoliceOfficerLogin } from '../sdk/model/policeOfficerLogin';
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
        protected userController: UserControllerService,
        @Inject('environment') protected environment,
        protected router: Router,
        public platform: Platform,
        protected nativeStorage: NativeStorage) { }

}

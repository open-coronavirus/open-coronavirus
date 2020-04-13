import {Injectable} from "@angular/core";
import {UniqueDeviceID} from "@ionic-native/unique-device-id/ngx";
import {InstallationControllerService, InstallationWithRelations} from "../sdk";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable()
export class InstallationService {

    public deviceId: string;
    public loadedDeviceId$ = new BehaviorSubject<boolean>(false);

    constructor(protected uniqueDeviceID: UniqueDeviceID,
                protected installationControllerService: InstallationControllerService
    ) {

        this.uniqueDeviceID.get().then((uuid: any) => {
            this.deviceId = uuid;
            this.loadedDeviceId$.next(true);
        })
        .catch((error: any) => {
            console.error('Error trying to regiter the installation: ' + JSON.stringify(error));
        });

    }

    public registerInstallation(patientId: string) {

        let returnValue = new Subject<boolean>();

        console.log('Register installation ...');

        this.loadedDeviceId$.subscribe(loaded => {
            if (loaded) {

                console.log('Unique device ID: ' + this.deviceId);

                let installation: InstallationWithRelations = new class implements InstallationWithRelations {
                    [key: string]: object | any;

                    created: string;
                    deviceId: string;
                    id: string;
                    patientId: string;
                }

                installation.deviceId = this.deviceId;
                installation.patientId = patientId;

                console.log('Call the API to regiter the installation ...');

                this.installationControllerService.installationControllerCreate(installation).subscribe(result => {
                    console.log('Installation registration successful!');
                    returnValue.next(true);
                })
            }
        });

        return returnValue;

    }

}

import {Injectable} from "@angular/core";
import {UniqueDeviceID} from "@ionic-native/unique-device-id/ngx";
import {InstallationControllerService, InstallationWithRelations} from "../sdk";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable()
export class InstallationService {

    constructor(protected uniqueDeviceID: UniqueDeviceID,
                protected installationControllerService: InstallationControllerService
    ) { }

    public registerInstallation(patientId: string) {

        let returnValue = new Subject<boolean>();

        console.log('Register installation ...');

        this.uniqueDeviceID.get()
            .then((uuid: any) => {

                console.log('Unique device ID: ' + uuid);

                let installation: InstallationWithRelations = new class implements InstallationWithRelations {
                    [key: string]: object | any;

                    created: string;
                    deviceId: string;
                    id: string;
                    patientId: string;
                }

                installation.deviceId = uuid;
                installation.patientId = patientId;

                console.log('Call the API to regiter the installation ...');

                this.installationControllerService.installationControllerCreate(installation).subscribe(result => {
                    console.log('Installation registration successful!');
                    returnValue.next(true);
                })

            })
            .catch((error: any) => {
                returnValue.next(false);
                console.error('Error trying to regiter the installation: ' + JSON.stringify(error));
            });

        return returnValue;

    }

}

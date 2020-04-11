import {Injectable} from "@angular/core";
import {UniqueDeviceID} from "@ionic-native/unique-device-id/ngx";
import {InstallationControllerService, InstallationWithRelations} from "../sdk";


@Injectable()
export class InstallationService {

    constructor(protected uniqueDeviceID: UniqueDeviceID,
                protected installationControllerService: InstallationControllerService
    ) { }

    public registerInstallation() {
        this.uniqueDeviceID.get()
            .then((uuid: any) => {

                let installation: InstallationWithRelations = new class implements InstallationWithRelations {
                    [key: string]: object | any;

                    created: string;
                    deviceId: string;
                    id: string;
                };

                installation.deviceId = uuid;

                this.installationControllerService.installationControllerCreate(installation).subscribe(result => {

                })

            })
            .catch((error: any) => console.log(error));
    }

}

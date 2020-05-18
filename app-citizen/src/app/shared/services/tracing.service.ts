import {Inject, Injectable} from "@angular/core";
import {ModalController, Platform} from "@ionic/angular";
import {KeyManagerService} from "./keys/key-manager.service";
import {ContactTrackerService} from "./contacts/contact-tracker.service";
import {ContactUploadRequestComponent} from "../../main/contact-upload-request/contact-upload-request.component";
import {ContactUploadThanksComponent} from "../../main/contact-upload-thanks/contact-upload-thanks.component";
import {PatientService} from "./patient.service";
import {InfectedKeyControllerService} from "../sdk";
import {InfectedKeysProcessorService} from "./keys/infected-keys-processor.service";
import {LoggingService} from "./logging.service";
import {PatientStatus} from "../../../../../server/src/common/utils/enums";
import {StorageService} from "./storage.service";


@Injectable()
export class TracingService {

    public static UPLOADED_KEY_TO_SERVER = 'uploadedKeyToServer';

    protected uploadedKeyToServer = false;

    constructor(protected contactTrackerService: ContactTrackerService,
                protected platform: Platform,
                protected patientService: PatientService,
                protected loggingService: LoggingService,
                protected storageService: StorageService,
                protected infectedKeysProcessorService: InfectedKeysProcessorService,
                protected infectedKeyControllerService: InfectedKeyControllerService,
                protected keyManagerService: KeyManagerService,
                protected modalController: ModalController,
                @Inject('settings') protected settings) {

        this.storageService.getItem(TracingService.UPLOADED_KEY_TO_SERVER).subscribe(uploaded => {
            if (uploaded == null) {
                this.storageService.setItem(TracingService.UPLOADED_KEY_TO_SERVER, false);
            }
            else {
                this.uploadedKeyToServer = uploaded;
            }

            this.patientService.patientDataChanged$.subscribe(changed => {
                if(this.patientService.patient.status == PatientStatus.INFECTED && !this.uploadedKeyToServer) {
                    if (this.autoShareActivated) {
                        this.loggingService.debug('Autoshare activated, uploading contacts ...');
                        this.trackInfectionToServer();
                    }
                    else {
                        this.showUploadContactRequestModal();
                    }
                }
            });

        })

    }


    public trackInfectionToServer() {

        return new Promise((resolve, reject) => {

            if (this.settings.useDecentralizedProtocol) {
                this.keyManagerService.uploadKeyToServer();
                this.uploadedKeyToServer = true;
                this.storageService.setItem(TracingService.UPLOADED_KEY_TO_SERVER, this.uploadedKeyToServer);
                resolve();
            } else {
                this.uploadContactsAndShowThanksModal().then(() => {
                    this.uploadedKeyToServer = true;
                    this.storageService.setItem(TracingService.UPLOADED_KEY_TO_SERVER, this.uploadedKeyToServer);
                    resolve() ;
                })
            }
        });
    }

    public checkNewInfectedKeys() {
        return new Promise((resolve, reject) => {
            this.infectedKeyControllerService.infectedKeyControllerFind({}).subscribe(async infectedKeys => {
                try {
                    await this.infectedKeysProcessorService.matchInfectedKeys(infectedKeys);
                } catch (error) {
                    this.loggingService.error("Error trying to match infected keys: " + JSON.stringify(error));
                }
                resolve();
            });
        });
    }

    async showUploadContactRequestModal() {
        const modalUploadContacts = await this.modalController.create(
            {
                component: ContactUploadRequestComponent,
                componentProps: {
                    autoShareActivated: this.autoShareActivated()
                }
            });

        modalUploadContacts.onDidDismiss()
            .then((response) => {
                if (response.data.accepts) {
                    this.uploadContactsAndShowThanksModal();

                }
            });

        return await modalUploadContacts.present();
    }

    async showUploadContactThanksModal() {
        const modalUploadContacts = await this.modalController.create(
            {
                component: ContactUploadThanksComponent
            });

        return await modalUploadContacts.present();
    }

    async uploadContactsAndShowThanksModal() {
        this.trackInfectionToServer().then( () => {
            this.showUploadContactThanksModal();
        });
    }

    async activateAutoShare() {
        this.patientService.patient.autoshare = true;
        const patient = this.patientService.patient;

        this.patientService.update(patient).subscribe(success => {

        });
    }

    autoShareActivated(): boolean {
        return (this.settings.autoshare || this.patientService.patient.autoshare);
    }


}

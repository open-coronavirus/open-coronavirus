import {Injectable} from "@angular/core";
import {ContactTrackerService} from "../contacts/contact-tracker.service";
import {
    InfectedKey,
    InfectedKeyControllerService,
    InfectionExposure,
    InfectionExposureControllerService
} from "../../sdk";
import {KeyManagerService} from "./key-manager.service";
import {PatientService} from "../patient.service";
import {Guid} from "guid-typescript";
import * as crypto from "crypto-js";
import {LoggingService} from "../logging.service";

@Injectable()
export class InfectedKeysProcessorService {

    public constructor(protected contactTrackerService: ContactTrackerService,
                       protected patientService: PatientService,
                       protected loggingService: LoggingService,
                       protected infectionExposureControllerService: InfectionExposureControllerService,
                       protected infectedKeyControllerService: InfectedKeyControllerService,
                       protected keyManagerService: KeyManagerService) {

    }

    public async matchInfectedKeys(infectedKeys: Array<InfectedKey>) {

        let limit = 100;
        let offset = 0;

        this.loggingService.debug("Start matching infected keys ...");

        let exposuresMatched = [];

        let sessionGuid = Guid.create().toString();
        let contactEntriesMatched = [];

        let existsMoreRows = true;
        do {

            let entries: any = await this.contactTrackerService.getContactEntries(limit, offset);
            if (entries.rows.length > 0) {

                for (let i = 0; i < entries.rows.length; i++) {
                    let row = entries.rows.item(i);

                    for(let key of infectedKeys) {

                        this.loggingService.debug("Checking key " + key.key + " ...");

                        let anonymizedInfectedUuid = crypto.MD5(sessionGuid + ":" + key.key).toString();

                        let keyToDecryptTo = this.keyManagerService.generateKey(key.key, new Date(key.keyDate).getTime(), row.encryption_timestamp);
                        let decryptedTimestamp = this.keyManagerService.decrypt(keyToDecryptTo, row.encrypted_data);
                        this.loggingService.debug("decrypted timestamp: " + decryptedTimestamp + ", encrypted timestamp: " + row.encrypted_data + ", encryption_timestamp: " + row.encryption_timestamp + ", key used to decrypt: " + keyToDecryptTo);
                        if(decryptedTimestamp  == row.encryption_timestamp.toString()) {
                            this.loggingService.debug("Detected one contact: " + JSON.stringify(row));
                            contactEntriesMatched.push(row);
                            this.loggingService.debug("Key was: " + key.key + " and sessionKey was: " + sessionGuid + ". anonymizedInfectedUuid was" + anonymizedInfectedUuid);
                            let infectionExposure: InfectionExposure = {
                                patientId: this.patientService.patient.id,
                                timestampFrom: row.timestamp_from,
                                timestampTo: row.timestamp_to,
                                anonymizedInfectedUuid: anonymizedInfectedUuid
                            };
                            //do not add if rssi is null
                            if(row.rssi != null) {
                                infectionExposure.rssi = row.rssi;
                            }
                            //contact with infection!!!!
                            exposuresMatched.push(infectionExposure);
                        }

                    }

                }

            } else {
                existsMoreRows = false;
            }

            offset = offset + limit;

        } while (existsMoreRows);

        if(exposuresMatched.length > 0) {
            //upload contacts to server
            this.loggingService.debug("Uploading a total of " + exposuresMatched.length + " infection exposures entries : " + JSON.stringify(exposuresMatched));
            this.infectionExposureControllerService.infectionExposureControllerCreateAll(exposuresMatched).subscribe(result => {
                this.loggingService.debug(exposuresMatched.length + " infection exposures entries uploaded!");
                this.contactTrackerService.deleteContacts(contactEntriesMatched);
            })
        }
        else {
            this.loggingService.debug("No infection exposures entries to upload to.");
        }

    }


}

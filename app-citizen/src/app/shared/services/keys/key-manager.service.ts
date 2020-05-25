import {Injectable} from "@angular/core";
import * as crypto from "crypto-js";
import {StorageService} from "../storage.service";
import {Guid} from "guid-typescript";
import {InfectedKey, InfectedKeyControllerService} from "../../sdk";
import {PatientService} from "../patient.service";
import {LoggingService} from "../logging.service";

@Injectable()
export class KeyManagerService {

    protected initialSK;
    protected initialDate;
    protected currentKey = null;
    protected currentDate: Date = null;

    public static SK_KEY = 'sk-key-V4';

    public constructor(protected storageService: StorageService,
                       protected patientService: PatientService,
                       protected loggingService: LoggingService,
                       protected infectedKeyControllerService: InfectedKeyControllerService) {

        this.storageService.getItem(KeyManagerService.SK_KEY).then(data => {
            if (data != null) {
                this.initialDate = new Date(data.initialDateTimestamp);
                this.initialSK = data.initialSK;
            } else {
                this.initialSK = this.generateNewKey(Guid.create().toString());
                this.initialDate = new Date();
                this.initialDate.setHours(0, 0, 0, 0);
                this.storageService.setItem(KeyManagerService.SK_KEY, {
                    initialDateTimestamp: this.initialDate.getTime(),
                    initialSK: this.initialSK
                });
            }
        });

    }

    public generateNewKey(value) {
        let key = crypto.SHA256(value).toString();

        return key;
    }

    public getDiffDays(initialTimestamp: number, endTimestamp: number) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((endTimestamp - initialTimestamp) / oneDay));
    }

    public getCurrentKey(): string {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if(this.currentDate == null || today.getTime() > this.currentDate.getTime()) {
            this.currentKey = this.generateKey(this.initialSK, this.initialDate.getTime(), today.getTime());
            this.currentDate = today;
        }
        return this.currentKey;
    }

    public generateKey(initialKey: string, initialTimestamp: number, currentTimestamp: number) {

        let currentDate = new Date(currentTimestamp);
        currentDate.setHours(0, 0, 0, 0); //trim the time

        const diffDays = this.getDiffDays(initialTimestamp, currentDate.getTime());
        this.loggingService.log("Difference in days is: " + diffDays);
        let returnValue = initialKey.toString();
        for (let i = 0; i < diffDays; i++) {
            returnValue = this.generateNewKey(returnValue);
        }

        return returnValue;

    }

    public generateEncryptedKey(): EncryptedKey {
        let returnValue = new EncryptedKey();
        let currentKey = this.getCurrentKey(); //this is so secret :)
        returnValue.timestamp = new Date().getTime(); //this is going to be returned in plain text and encrypted as well
        returnValue.encryptedData = crypto.AES.encrypt(returnValue.timestamp.toString(), currentKey).toString();
        return returnValue;
    }

    public decrypt(key: string, encriptedData: string) {
        let returnValue = null;
        try {
            let decryptedData = crypto.AES.decrypt(encriptedData, key);
            if (decryptedData != null) {
                returnValue = decryptedData.toString(crypto.enc.Utf8);
            }
        }
        catch(error) {
            this.loggingService.log("Error trying to decrypt [" + encriptedData + "] with key [" + key + "] : " + JSON.stringify(error));
        }
        return returnValue;
    }

    public uploadKeyToServer() {

        let infectedKey: InfectedKey = new class implements InfectedKey {
            [key: string]: object | any;

            created: string;
            id: string;
            infectionDate: string;
            key: string;
            keyDate: string;
        };

        infectedKey.key = this.initialSK;
        infectedKey.keyDate = this.initialDate.toJSON();
        if(this.patientService.patient.statusDate != null) {
            infectedKey.infectionDate = this.patientService.patient.statusDate.toString();
        }

        this.infectedKeyControllerService.infectedKeyControllerCreate(infectedKey).subscribe(result => {
            //todo
        });

    }

}

export class EncryptedKey {

    public encryptedData: string;
    public timestamp: number;

}


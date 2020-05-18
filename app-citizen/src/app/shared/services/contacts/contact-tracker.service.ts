import {Inject, Injectable} from "@angular/core";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {BehaviorSubject, Subject} from "rxjs";
import {Contact} from "./contact";
import {ModalController, Platform} from "@ionic/angular";
import {ContactControllerService, ContactWithRelations} from "../../sdk";
import {PatientService} from "../patient.service";
import {EncryptedKey} from "../keys/key-manager.service";
import {LoggingService} from "../logging.service";


@Injectable()
export class ContactTrackerService {

    protected db;

    private knownContacts = new Map<string, Contact>();

    private patientServiceUUID: string;

    public nearestDevices = new Map<string, any>();

    public contactsCount$ = new BehaviorSubject<number>(0);

    public connectedToDb$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public contactAdded$ = new BehaviorSubject<boolean>(false);
    public contactAddedOrUpdated$ = new BehaviorSubject<boolean>(false);

    public constructor(protected sqlite: SQLite,
                       protected contactControllerService: ContactControllerService,
                       protected patientService: PatientService,
                       protected loggingService: LoggingService,
                       protected platform: Platform,
                       protected modalController: ModalController,
                       @Inject('settings') protected settings) {

        this.patientService.patientLoaded$.subscribe(loaded => {
            if(loaded) {
                this.patientServiceUUID = this.patientService.patient.serviceAdvertisementUUID;

                if(!this.platform.is('desktop')) {

                    let dbConfiguration = {name: 'open-coronavirus.db'};
                    if (this.platform.is('android')) {
                        dbConfiguration['location'] = 'default';
                    } else if (this.platform.is('ios')) {
                        dbConfiguration['iosDatabaseLocation'] = 'default';
                    }

                    let promise = sqlite.create(dbConfiguration);

                    if(promise != null) {
                        promise.then((db: SQLiteObject) => {
                            this.db = db;
                            this.loggingService.log("Connected: " + JSON.stringify(db));
                            this.db.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='contacts'", []).then(result => {
                                if (result.rows.length > 0) {
                                    this.loggingService.debug("Table contacts already exists!")
                                    this.connectedToDb$.next(true);
                                    this.refreshContactsCount();
                                } else {
                                    this.loggingService.debug("Table contacts does not exits. Creatint it ...")
                                    this.db.executeSql('CREATE TABLE contacts (id VARCHAR(32), address VARCHAR(256), encrypted_data TEXT, encryption_timestamp INTEGER, timestamp_from INTEGER, timestamp_to INTEGER, rssi INT);', [])
                                        .then(() => {
                                            this.connectedToDb$.next(true);
                                        })
                                        .catch(e => this.loggingService.error(e));
                                }
                            })
                                .catch(noResults => {
                                    this.loggingService.error("Error checking database status at the very beginning: " + JSON.stringify(noResults));
                                });
                        });
                    }

                }

            }
        })

    }

    public trackContact(address: string, encryptedData: EncryptedKey, rssi: number) {

        let contact = new Contact();
        contact.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        contact.address = address;
        contact.encryptedData = encryptedData.encryptedData;
        contact.encryptionTimestamp = encryptedData.timestamp;
        contact.timestampFrom = new Date().getTime();
        contact.timestampTo = new Date().getTime();
        contact.rssi = rssi;

        return this._doTrackContact(contact);

    }

    public refreshContactsCount() {
        this.getContactsCount().then((contactsCount: number) => {
            this.contactsCount$.next(contactsCount);
        })
    }

    public _doTrackContact(contact: Contact) {

        let returnValue: Subject<boolean> = new Subject();

        if(this.db != null) {

            this.db.executeSql("INSERT INTO contacts(id, address, encrypted_data, encryption_timestamp, timestamp_from, timestamp_to, rssi) values (?, ?, ?, ?, ?, ?, ?)",
                [contact.id, contact.address, contact.encryptedData, contact.encryptionTimestamp, contact.timestampFrom, contact.timestampTo, contact.rssi]).then(result => {
                this.knownContacts.set(contact.address, contact); //update the contact
                this.loggingService.debug("[Contact tracker] Inserted new contact from address " + contact.address);
                returnValue.next(true);
                this.refreshContactsCount();
                let devicesToRemove = [];
                for (let value of this.nearestDevices.values()) {
                    if(value.address == contact.address && value.id != contact.id) {
                        devicesToRemove.push(value.id);
                    }
                }
                devicesToRemove.forEach(deviceToRemove => {
                    this.nearestDevices.delete(deviceToRemove);
                });
                this.nearestDevices.set(contact.id, {id: contact.id, address: contact.address, encryptedData: contact.encryptedData, rssi: contact.rssi, date: new Date()});
                this.contactAdded$.next(true);
                this.contactAddedOrUpdated$.next(true);
            }).catch(error => {
                this.loggingService.error("Error trying to insert a contact from address " + contact.address + ": " + JSON.stringify(error));
                returnValue.next(false);
            });
        }
        else {
            returnValue.next(false);
        }

        return returnValue;
    }

    public isKnownContact(address) {

        if(this.knownContacts.has(address)) {
            return true;
        }
        return false;

    }

    public getContactsCount() {
        return new Promise((resolve, reject) => {
            if(this.db != null) {
                this.db.executeSql('SELECT count(distinct(address)) AS TOTAL FROM contacts', []).then(result => {
                    this.loggingService.log('[Contact tracker] contacts count: ' + JSON.stringify(result.rows.item(0).TOTAL));
                    resolve(result.rows.item(0).TOTAL);
                }).catch(error => {
                    this.loggingService.error("Error trying to retrieve contacts: " + JSON.stringify(error));
                    reject(error);
                });
            }
            else {
                reject(false);
            }
        });

    }

    public updateTrack(address, rssi) {

        //for contacts being registered in the last hour, just update the signal and the timestamp
        //otherwise create a new contact
        if (this.knownContacts.has(address)) {
            if (new Date().getTime() - this.knownContacts.get(address).timestampTo - 3600000 > 0) {
                let contact = this.knownContacts.get(address);
                this.trackContact(contact.address, contact.toEncryptedData(), rssi);
            } else {
                this._updateTrack(address, rssi);
            }
        }

    }

    public _updateTrack(address, rssi) {
        let returnValue: Subject<boolean> = new Subject();

        if(this.db != null) {

            let updateContact = false;

            let contact = this.knownContacts.get(address);
            if (contact.rssi < rssi) {
                contact.rssi = rssi;
                updateContact = true;
            }
            else if(new Date().getTime() - contact.timestampTo - 60000 > 0) {
                updateContact = true;
            }

            if(updateContact) {
                contact.timestampTo = new Date().getTime();
                this.db.executeSql("UPDATE contacts set rssi = ?, timestamp_to = ? where id = ?",
                    [contact.rssi, contact.timestampTo, contact.id]).then(result => {
                    this.knownContacts.set(address, contact); //update the contact
                    this.loggingService.debug("[Contact tracker] Updated existing contact from address " + contact.address);
                    if (this.nearestDevices.has(contact.id)) {
                        this.nearestDevices.get(contact.id)['rssi'] = rssi;
                        this.nearestDevices.get(contact.id)['date'] = new Date();
                    }
                    this.contactAddedOrUpdated$.next(true);
                    returnValue.next(true);
                }).catch(error => {
                    this.loggingService.error("Error trying to insert a contact from address " + contact.address + ": " + JSON.stringify(error));
                    returnValue.next(false);
                });
            }
        }
        else {
            returnValue.next(false);
        }
        return returnValue;
    }


    public async getContactEntries(limit = 100, offset= 0) {

        return new Promise((resolve, reject) => {
            if(this.db != null) {
                this.db.executeSql(`SELECT * FROM contacts order by timestamp_from desc limit ${limit} offset ${offset}`, []).then(result => {
                    resolve(result);
                }).catch(error => {
                    this.loggingService.error("Error trying to retrieve contacts: " + JSON.stringify(error));
                    reject(error);
                });
            }
            else {
                reject(false);
            }
        });
    }

    public async uploadContactsToServer() {

        let limit = 100;
        let offset = 0;

        if(this.db != null) {

            let existsMoreRows = true;
            do {

                let entries: any = await this.getContactEntries(limit, offset);
                if (entries.rows.length > 0) {
                    let contactsToUpload = [];
                    for (let i = 0; i < entries.rows.length; i++) {
                        let row = entries.rows.item(i);
                        let contactToUpload: ContactWithRelations = new class implements ContactWithRelations {
                            [key: string]: object | any;

                            id: string;
                            rssi: number;
                            sourceUuid: string;
                            targetUuid: string;
                            timestampFrom: number;
                            timestampTo: number;
                        }

                        contactToUpload.rssi = row.rssi;
                        contactToUpload.sourceUuid = this.patientServiceUUID;
                        contactToUpload.targetUuid = row.uuid;
                        contactToUpload.timestampFrom = row.timestamp_from;
                        contactToUpload.timestampTo = row.timestamp_to;

                        contactsToUpload.push(contactToUpload);

                    }
                    this.loggingService.log("[Contact tracker] Upload a total of " + contactsToUpload.length + " contacts to server: " + JSON.stringify(contactsToUpload));
                    this.contactControllerService.contactControllerCreateAll(contactsToUpload).subscribe(result => {
                        this.loggingService.log("[Contact tracker] Uploaded a total of " + contactsToUpload.length + " contacts to server.");
                        this.db.executeSql('DELETE FROM contacts', [])
                            .then(() => {
                                this.connectedToDb$.next(true);
                                this.contactsCount$.next(0);
                            })
                            .catch(e => this.loggingService.error(e));
                    },
                    error => {
                        this.loggingService.error(JSON.stringify(error));
                    });
                } else {
                    existsMoreRows = false;
                }

                offset = offset + limit;

            } while (existsMoreRows);
        }

    }

    async deleteContacts(contactsToDelete: any[]) {
        for (const contactToDelete of contactsToDelete) {
            await this.db.executeSql('DELETE FROM contacts where id = ?', [contactToDelete.id]);
        }
        this.refreshContactsCount();
    }

}

import {Injectable} from "@angular/core";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite/ngx";
import {BehaviorSubject, Subject} from "rxjs";
import {Contact} from "./contact";
import {Platform} from "@ionic/angular";


@Injectable()
export class ContactTrackerService {

    protected db;

    private knownContacts = new Map<string, Contact>();

    public connectedToDb$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public constructor(private sqlite: SQLite,
                       protected platform: Platform) {

        let dbConfiguration = { name: 'open-coronavirus.db' };
        if(this.platform.is('android')) {
            dbConfiguration['location'] = 'default';
        }
        else {
            dbConfiguration['iosDatabaseLocation'] = 'default';
        }

        sqlite.create(dbConfiguration).then((db: SQLiteObject) => {
            this.db = db;
            console.log("Connected: " + JSON.stringify(db));
            this.db.executeSql("SELECT * FROM sqlite_master WHERE type='table' AND name='contacts'", []).then(result => {
                if(result.rows.length > 0) {
                    console.debug("Table contacts already exists!")
                    this.connectedToDb$.next(true);
                }
                else {
                    console.debug("Table contacts does not exits. Creatint it ...")
                    this.db.executeSql('CREATE TABLE contacts (id varchar(32), uuid varchar(36), timestamp_from timestamp, timestamp_to timestamp, rssi int);', [])
                        .then(() => {
                            this.connectedToDb$.next(true);
                        })
                        .catch(e => console.error(e));
                }
            })
            .catch(noResults => {
                console.error("Error checking database status at the very beginning: " + JSON.stringify(noResults));
            });

        });

    }

    public trackContact(uuid: string, rssi: number, address: string) {

        let contact = new Contact();
        contact.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        contact.uuid = uuid;
        contact.timestampTo = new Date().getTime();
        contact.timestampFrom = new Date().getTime();
        contact.rssi = rssi;

        return this._doTrackContact(contact, address);

    }

    public _doTrackContact(contact: Contact, address: string) {

        let returnValue: Subject<boolean> = new Subject();

        this.db.executeSql("INSERT INTO contacts(id, uuid, timestamp_from, timestamp_to, rssi) values (?, ?, ?, ?, ?)",
            [contact.id, contact.uuid, contact.timestampFrom, contact.timestampTo, contact.rssi]).then(result => {
            this.knownContacts.set(address, contact); //update the contact
            console.debug("[Contact tracker] Inserted new contact with uuid " + contact.uuid);
            returnValue.next(true);
        }).catch(error => {
            console.error("Error trying to insert a contact: " + contact.uuid);
            returnValue.next(false);
        });

        return returnValue;
    }

    public isKnownContact(address) {

        if(this.knownContacts.has(address)) {
            return true;
        }
        return false;

    }

    public updateTrack(address, rssi) {

        //for contacts being registered in the last 5 minutes, just update the signal and the timestamp
        //otherwise create a new contact
        if (new Date().getTime() - this.knownContacts.get(address).timestampTo - 300000 > 0) {
            let contact = this.knownContacts.get(address);
            this.trackContact(contact.uuid, rssi, address);
        }
        else {
            this._updateTrack(address, rssi);
        }

    }

    public _updateTrack(address, rssi) {
        let returnValue: Subject<boolean> = new Subject();

        let contact = this.knownContacts.get(address);
        if(contact.rssi < rssi) {
            contact.rssi = rssi;
        }
        contact.timestampTo = new Date().getTime();

        this.db.executeSql("UPDATE contacts set rssi = ?, timestamp_to = ? where id = ?",
            [contact.rssi, contact.timestampTo, contact.id]).then(result => {
            this.knownContacts.set(address, contact); //update the contact
            console.debug("[Contact tracker] Updated existing contact with uuid " + contact.uuid);
            returnValue.next(true);
        }).catch(error => {
            console.error("Error trying to insert a contact: " + contact.uuid);
            returnValue.next(false);
        });

        return returnValue;
    }



}

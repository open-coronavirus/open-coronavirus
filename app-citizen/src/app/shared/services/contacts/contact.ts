import {EncryptedKey} from "../keys/key-manager.service";

export class Contact {

    public id: string;
    public address: string;
    public encryptedData: string;
    public encryptionTimestamp: number;
    public timestampFrom: number;
    public timestampTo: number;
    public rssi: number;

    public toEncryptedData() {
        let returnValue = new EncryptedKey();
        returnValue.timestamp = this.encryptionTimestamp;
        returnValue.encryptedData = this.encryptedData;

        return returnValue;
    }

}

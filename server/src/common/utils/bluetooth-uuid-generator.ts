import {Guid} from "guid-typescript";


export class BluetoothUuidGenerator {

    public static generateUUID() {
        let returnValue = Guid.create().toString();

        //replace first 2 digits by 0C (like OC of Open Coronavirus)
        returnValue = '0c' + returnValue.substr(2);

        return returnValue;
    }

}

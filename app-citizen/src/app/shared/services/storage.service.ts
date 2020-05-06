import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {NativeStorage} from "@ionic-native/native-storage/ngx";
import {Platform} from "@ionic/angular";

@Injectable()
export class StorageService {

    constructor(protected nativeStorage: NativeStorage,
                public platform: Platform) {
    }

    public getItem(key: string) {
        let returnValue: Subject<any> = new Subject();
        this.platform.ready().then(() => {
            this.nativeStorage.getItem(key).then(data => {
                returnValue.next(JSON.parse(data));
            })
            .catch(reason => {
                //try with web local storage
                returnValue.next(JSON.parse(localStorage.getItem(key)));
            });
        });
        return returnValue;
    }

    public setItem(key: string, value: any) {
        value = JSON.stringify(value);
        let returnValue: Subject<any> = new Subject();
        this.nativeStorage.setItem(key, value).then(result => {
            returnValue.next(result);
        })
        .catch(reason => {
            //try with web local storage
            returnValue.next(localStorage.setItem(key, value));
        });

        return returnValue;
    }

}

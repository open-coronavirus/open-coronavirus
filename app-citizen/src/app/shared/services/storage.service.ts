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
        return new Promise<any>((resolve, reject) => {
            this.platform.ready().then(() => {
                this.nativeStorage.getItem(key).then(data => {
                    resolve(JSON.parse(data));
                })
                    .catch(reason => {
                        //try with web local storage
                        resolve(JSON.parse(localStorage.getItem(key)));
                    });
            });
        });
    }

    public setItem(key: string, value: any) {
        return new Promise<any>((resolve, reject) => {
            value = JSON.stringify(value);
            this.nativeStorage.setItem(key, value).then(result => {
                resolve(result);
            })
                .catch(reason => {
                    //try with web local storage
                    resolve(localStorage.setItem(key, value));
                });
        });
    }

}

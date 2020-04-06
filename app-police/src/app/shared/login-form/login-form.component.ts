import {AfterViewInit, Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import { UserCredentials } from '../sdk/model/userCredentials';


@Component({
    selector: 'login-form',
    templateUrl: 'login-form.component.html',
    styleUrls: ['login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy, AfterViewInit {

    public loginInfoForm: FormGroup;

    public get isValid(): boolean {
        if (this.loginInfoForm != null) {
            if (this.loginInfoForm.status != 'INVALID') {
                return true;
            }
        }
        return false;
    }

    @Input('user')
    public user: UserCredentials = new class implements UserCredentials {
        [key: string]: object | any;
        identifier: string;
        password: string;
    };

    @Output('onChange')
    public onChange: Subject<any> = new Subject();

    get identifier() {
        return this.loginInfoForm.get('identifier');
    }

    get password() {
        return this.loginInfoForm.get('password');
    }

    protected subscriptions: Subscription[] = new Array<Subscription>();

    public constructor(protected formBuilder: FormBuilder) {

    }

    public ngOnInit() {

        this.loginInfoForm = this.formBuilder.group({
            password: new FormControl(this.user.password, [Validators.required]),
            identifier: new FormControl(this.user.identifier, [
                Validators.required])
                // Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i)]),
        });

        this.subscriptions.push(this.loginInfoForm.get('identifier').valueChanges
            .subscribe(value => {
                this.user.identifier = value;
                this.onChange.next(this.user);
            }));

        this.subscriptions.push(this.loginInfoForm.get('password').valueChanges
            .subscribe(value => {
                this.user.password = value;
                this.onChange.next(this.user);
            }));

    }

    public validate() {
        for (var i in this.loginInfoForm.controls) {
            this.loginInfoForm.controls[i].markAsTouched();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public ngAfterViewInit() {
        // todo
    }


}

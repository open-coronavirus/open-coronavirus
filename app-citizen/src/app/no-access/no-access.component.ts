import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'no-access',
    templateUrl: 'no-access.component.html',
    styleUrls: ['no-access.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoAccessComponent {

    public techSupportPhone: string;

    public constructor(protected router: Router,
                       @Inject('environment') protected environment) {
        this.techSupportPhone = this.environment.techSupportPhone;
    }

    public callToTechnicalSupport() {
        window.location.href = 'tel:' + this.environment.techSupportPhone;
    }

    public backToRegisterForm() {
        this.router.navigate(['/register']);
    }

}

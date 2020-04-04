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
                       @Inject('settings') protected settings) {
        this.techSupportPhone = this.settings.techSupportPhone;
    }

    public callToTechnicalSupport() {
        window.location.href = 'tel:' + this.settings.techSupportPhone;
    }

    public backToRegisterForm() {
        this.router.navigate(['/register']);
    }

}

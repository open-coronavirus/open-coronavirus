import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'no-access',
    templateUrl: 'no-access.component.html',
    styleUrls: ['no-access.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoAccessComponent {

    public constructor(protected router: Router) {

    }

    public callToTechnicalSupport() {
        window.location.href = 'tel:999888777';
    }

    public backToRegisterForm() {
        this.router.navigate(['/register']);
    }

}

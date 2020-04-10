import { Injectable, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PermissionsModalComponent } from 'src/app/permissions-modal/permissions-modal.component';
import { Router } from '@angular/router';


@Injectable()
export class PermissionsService {

    constructor(
        private modalController: ModalController,
        @Inject('settings') protected settings,
        protected router: Router
    ) {
    }

    async requestAllPermissions(finalUrl) {
        const requiredPermissions = this.getRequiredPermissions();
        this.showAllPermissionModals(requiredPermissions, finalUrl);

    }

    getRequiredPermissions(): Array<string> {
        const requiredPermissions = ['push'];

        for (const type in this.settings.permissions) {
            if (this.settings.permissions[type]) {
                requiredPermissions.push(type);
            }
        }

        return requiredPermissions;
    }

    async showAllPermissionModals(requiredPermissions: Array<string>, finalUrl: string) {
        const modalPermissions = await this.modalController.create(
            {
                component: PermissionsModalComponent,
                componentProps: {
                    type: requiredPermissions.shift()
                 }
            });

        modalPermissions.onDidDismiss()
            .then(() => {
                if (requiredPermissions.length === 0) {
                    this.router.navigate([finalUrl]);
                } else {
                    this.showAllPermissionModals(requiredPermissions, finalUrl);
                }
            });

        return await modalPermissions.present();
    }

}

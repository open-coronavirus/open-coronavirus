import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PoliceOfficerWithRelations } from '../sdk/model/policeOfficerWithRelations';
import { UserService } from '../services/user.service';


@Component({
    selector: 'corona-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class CoronaHeaderComponent implements OnInit {

    private user: PoliceOfficerWithRelations;
    private userName: string;

    constructor(
        protected menu: MenuController,
        protected userService: UserService,
    ) {

    }

    ngOnInit() {
        this.user = this.userService.user;
        if (this.user) {
            this.userName = this.user.firstName + ' ' + this.user.lastName;
        }
    }

    openMenu() {
        this.menu.enable(true, 'menu');
        this.menu.open('menu');
    }

}

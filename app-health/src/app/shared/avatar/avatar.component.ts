import { Component, Input, OnInit, OnChanges } from '@angular/core';


@Component({
    selector: 'avatar',
    templateUrl: 'avatar.component.html',
    styleUrls: ['avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

    @Input() userName: string;

    public chartUser: string;

    constructor() {


    }


    ngOnInit() {
        // this.chartUser = this.userName.charAt(0);
    }

    ngOnChanges(changes) {
        if (changes.userName) {
            if (changes.userName && changes.userName.currentValue) {
                this.chartUser = changes.userName.currentValue.charAt(0);
            }
        }
    }

}

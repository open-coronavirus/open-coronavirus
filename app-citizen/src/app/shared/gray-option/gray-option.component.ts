import {Component, Input, Output, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    selector: 'gray-option',
    templateUrl: 'gray-option.component.html',
    styleUrls: ['gray-option.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GrayOptionComponent {

    @Input('text')
    public text;

    @Input('icon')
    public icon;

    @Input('value')
    public value;

    @Output('click')
    public click$: Subject<any> = new Subject<any>();

    public onClick() {
        this.click$.next(this.value);
    }

    public resetSubjects() {
        this.click$ = new Subject<any>();
    }

}

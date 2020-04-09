import { OnChanges, Renderer2, ElementRef } from '@angular/core';
export declare class NgxQRCodeComponent implements OnChanges {
    private renderer;
    elementType: 'url' | 'img' | 'canvas';
    cssClass: string;
    value: string;
    version: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40' | '';
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    qrcElement: ElementRef;
    constructor(renderer: Renderer2);
    ngOnChanges(): void;
    toDataURL(): Promise<{}>;
    toCanvas(canvas: any): Promise<{}>;
    renderElement(element: any): void;
    createQRCode(): void;
}

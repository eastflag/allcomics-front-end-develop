import { Component, Input } from '@angular/core';
import { TemplateInfo } from '@app/models/templateInfo';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

    @Input() templateInfo: TemplateInfo;

    constructor() { }
}

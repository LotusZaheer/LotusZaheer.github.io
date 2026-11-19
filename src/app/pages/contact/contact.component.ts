import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { contactMethods } from '../../data/portfolio';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    contactMethods = contactMethods;
}

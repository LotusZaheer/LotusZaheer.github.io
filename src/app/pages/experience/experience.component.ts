import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { experiences } from '../../data/portfolio';

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
    experiences = experiences;
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { skillCategories } from '../../data/portfolio';

@Component({
    selector: 'app-skills',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './skills.component.html',
    styleUrl: './skills.component.scss'
})
export class SkillsComponent {
    categories = skillCategories;

    getColumnClass(index: number, total: number): string {
        // First 3 categories take 4 cols (3-up row); the rest take 6 (2-up rows).
        return index < 3 ? 'col-4' : 'col-6';
    }
}

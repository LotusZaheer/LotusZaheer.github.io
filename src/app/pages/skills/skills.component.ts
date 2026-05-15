import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../services/supabase.service';
import { forkJoin } from 'rxjs';
import { languageIcons, markupStyleIcons, libraryIcons, frameworkIcons, platformIcons, apiIcons, TechIcon } from '../../data/tech-icons.data';

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
export class SkillsComponent implements OnInit {
    categories: any[] = [];

    // Icons for fallback
    allIcons: TechIcon[] = [
        ...languageIcons,
        ...markupStyleIcons,
        ...libraryIcons,
        ...frameworkIcons,
        ...platformIcons,
        ...apiIcons
    ];

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        forkJoin({
            cats: this.supabase.getSkillCategories(),
            skills: this.supabase.getSkills()
        }).subscribe(({ cats, skills }) => {
            this.categories = cats.map(cat => ({
                ...cat,
                name: cat.name, // Ensure name is accessible
                skills: skills.filter(s => s.categoryId === cat.id)
            }));
        });
    }

    getIcon(skill: any): string | null {
        // 1. DB Icon (if implemented in future, currently undefined in fetching?)
        // The fetch includes * so if 'icon' column exists it's here.
        if (skill.icon) return skill.icon;

        // 2. Fallback to static mapping
        const found = this.allIcons.find(icon => icon.name.toLowerCase() === skill.name.toLowerCase());
        return found ? found.iconPath : null;
    }

    getColumnClass(index: number, total: number): string {
        // First 3 categories take 4 cols (3-up row); the rest take 6 (2-up rows).
        return index < 3 ? 'col-4' : 'col-6';
    }
}
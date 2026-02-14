import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../services/supabase.service';
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
    languages: string[] = [];
    markupStyles: string[] = [];
    frameworks: string[] = [];
    libraries: string[] = [];
    platforms: string[] = [];
    apis: string[] = [];

    languageIcons = languageIcons;
    markupStyleIcons = markupStyleIcons;
    frameworkIcons = frameworkIcons;
    libraryIcons = libraryIcons;
    platformIcons = platformIcons;
    apiIcons = apiIcons;

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.supabase.getProjects().subscribe(projects => {
            this.updateTechStack(projects);
        });
    }

    private updateTechStack(projects: any[]) {
        const allLanguages = new Set<string>();
        const allMarkup = new Set<string>();
        const allFrameworks = new Set<string>();
        const allLibraries = new Set<string>();
        const allPlatforms = new Set<string>();
        const allApis = new Set<string>();

        projects.forEach(project => {
            project.languages?.forEach((l: string) => allLanguages.add(l));
            project.markupStyles?.forEach((m: string) => allMarkup.add(m));
            project.frameworks?.forEach((f: string) => allFrameworks.add(f));
            project.libraries?.forEach((lib: string) => allLibraries.add(lib));
            project.platforms?.forEach((p: string) => allPlatforms.add(p));
            project.apis?.forEach((a: string) => allApis.add(a));
        });

        this.languages = Array.from(allLanguages).sort();
        this.markupStyles = Array.from(allMarkup).sort();
        this.frameworks = Array.from(allFrameworks).sort();
        this.libraries = Array.from(allLibraries).sort();
        this.platforms = Array.from(allPlatforms).sort();
        this.apis = Array.from(allApis).sort();
    }

    getIcon(name: string, icons: TechIcon[]): string | null {
        const icon = icons.find(icon => icon.name === name);
        return icon ? icon.iconPath : null;
    }
}
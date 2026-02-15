import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-cms-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cms-dashboard.component.html',
    styleUrl: './cms-dashboard.component.scss'
})
export class CmsDashboardComponent implements OnInit {
    projectCount = 0;
    featuredProjectCount = 0;
    socialCount = 0;
    contactCount = 0;
    skillCount = 0;
    skillCategoryCount = 0;
    languageCount = 0;
    keyCount = 0;

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.supabase.getProjects().subscribe(p => {
            this.projectCount = p.length;
            this.featuredProjectCount = p.filter(proj => proj.featured).length;
        });
        this.supabase.getSocialNetworks().subscribe(s => this.socialCount = s.length);
        this.supabase.getContactMethods().subscribe(c => this.contactCount = c.length);
        this.supabase.getSkills().subscribe(s => this.skillCount = s.length);
        this.supabase.getSkillCategories().subscribe(s => this.skillCategoryCount = s.length);
        this.supabase.getLanguages().subscribe(l => this.languageCount = l.length);
        this.supabase.getKeys().then(k => this.keyCount = k.length);
    }
}

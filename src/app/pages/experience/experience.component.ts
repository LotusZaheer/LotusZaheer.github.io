import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '../../services/supabase.service';

interface ExperienceItem {
    id: number;
    company: string;
    company_url?: string | null;
    role_key: string;
    duration_key: string;
    location_key: string;
    description_key: string;
    bullets_keys?: string[];
    stack: string[];
    is_current?: boolean;
}

@Component({
    selector: 'app-experience',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
    experiences: ExperienceItem[] = [];
    loading = false;

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.loading = true;
        this.supabase.getExperiences().subscribe(data => {
            this.experiences = (data || []).map((row: any) => ({
                id: row.id,
                company: row.company,
                company_url: row.company_url,
                role_key: row.role_key,
                duration_key: row.duration_key,
                location_key: row.location_key,
                description_key: row.description_key,
                bullets_keys: row.bullets_keys || [],
                stack: row.stack || [],
                is_current: !!row.is_current
            }));
            this.loading = false;
        });
    }
}

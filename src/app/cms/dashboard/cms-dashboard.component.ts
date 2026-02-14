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
    socialCount = 0;
    contactCount = 0;

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.supabase.getProjects().subscribe(p => this.projectCount = p.length);
        this.supabase.getSocialNetworks().subscribe(s => this.socialCount = s.length);
        this.supabase.getContactMethods().subscribe(c => this.contactCount = c.length);
    }
}

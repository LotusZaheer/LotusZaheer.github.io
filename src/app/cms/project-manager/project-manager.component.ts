import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-project-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './project-manager.component.html',
    styleUrl: './project-manager.component.scss'
})
export class ProjectManagerComponent implements OnInit {
    projects: any[] = [];
    editing: any = null;
    showForm = false;
    loading = false;
    saving = false;

    form: any = this.emptyForm();

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.loadProjects();
    }

    emptyForm() {
        return {
            title: '',
            description: '',
            frameworks: '',
            apis: '',
            libraries: '',
            platforms: '',
            languages: '',
            markupStyles: '',
            company: '',
            companyUrl: '',
            role: '',
            images: '',
            liveUrl: '',
            repoUrl: '',
            featured: false
        };
    }

    loadProjects() {
        this.loading = true;
        this.supabase.getProjects().subscribe(data => {
            this.projects = data;
            this.loading = false;
        });
    }

    openNew() {
        this.editing = null;
        this.form = this.emptyForm();
        this.showForm = true;
    }

    openEdit(project: any) {
        this.editing = project;
        this.form = {
            title: project.title || '',
            description: project.description || '',
            frameworks: (project.frameworks || []).join(', '),
            apis: (project.apis || []).join(', '),
            libraries: (project.libraries || []).join(', '),
            platforms: (project.platforms || []).join(', '),
            languages: (project.languages || []).join(', '),
            markupStyles: (project.markupStyles || []).join(', '),
            company: project.company || '',
            companyUrl: project.companyUrl || '',
            role: project.role || '',
            images: (project.images || []).join(', '),
            liveUrl: project.liveUrl || '',
            repoUrl: project.repoUrl || '',
            featured: project.featured || false
        };
        this.showForm = true;
    }

    cancel() {
        this.showForm = false;
        this.editing = null;
        this.form = this.emptyForm();
    }

    toArray(val: string): string[] {
        return val ? val.split(',').map(s => s.trim()).filter(s => s) : [];
    }

    async save() {
        this.saving = true;
        const data = {
            title: this.form.title,
            description: this.form.description,
            frameworks: this.toArray(this.form.frameworks),
            apis: this.toArray(this.form.apis),
            libraries: this.toArray(this.form.libraries),
            platforms: this.toArray(this.form.platforms),
            languages: this.toArray(this.form.languages),
            markupStyles: this.toArray(this.form.markupStyles),
            company: this.form.company,
            companyUrl: this.form.companyUrl,
            role: this.form.role,
            images: this.toArray(this.form.images),
            liveUrl: this.form.liveUrl,
            repoUrl: this.form.repoUrl,
            featured: this.form.featured,
            currentImageIndex: 0,
            progress: 0
        };

        if (this.editing) {
            await this.supabase.updateProject(this.editing.id, data);
        } else {
            await this.supabase.createProject(data);
        }

        this.saving = false;
        this.cancel();
        this.loadProjects();
    }

    async delete(id: number) {
        if (confirm('¿Eliminar este proyecto?')) {
            await this.supabase.deleteProject(id);
            this.loadProjects();
        }
    }

    async onImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const url = await this.supabase.uploadImage(input.files[0]);
            if (url) {
                const current = this.form.images ? this.form.images + ', ' : '';
                this.form.images = current + url;
            }
        }
    }
}

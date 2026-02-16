import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-project-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './project-manager.component.html',
    styleUrl: './project-manager.component.scss'
})
export class ProjectManagerComponent implements OnInit {
    projects: any[] = [];
    editing: any = null;
    showForm = false;
    loading = false;
    saving = false;

    // Skills
    allSkills: any[] = [];
    selectedSkillIds: Set<number> = new Set();
    skillFilter = '';

    // i18n Additional Info
    activeInfoTab: 'es' | 'en' = 'es';
    additionalInfoES = '';
    additionalInfoEN = '';

    form: any = this.emptyForm();

    constructor(
        private supabase: SupabaseService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadProjects();
        this.loadSkills();
        // Ensure translations are up to date
        const lang = this.translate.currentLang || 'es';
        this.translate.reloadLang(lang).subscribe(() => this.translate.use(lang));
    }

    emptyForm() {
        return {
            title: '',
            description: '',
            company: '',
            companyUrl: '',
            role: '',
            images: '',
            liveUrl: '',
            repoUrl: '',
            featured: false,
            // additional_info will be handled by separate variables ES/EN
        };
    }

    loadProjects() {
        this.loading = true;
        this.supabase.getProjects().subscribe(data => {
            this.projects = data;
            this.loading = false;
        });
    }

    loadSkills() {
        this.supabase.getSkills().subscribe(data => {
            this.allSkills = data;
        });
    }

    openNew() {
        this.editing = null;
        this.form = this.emptyForm();
        this.selectedSkillIds.clear();
        this.skillFilter = '';
        this.activeInfoTab = 'es';
        this.additionalInfoES = '';
        this.additionalInfoEN = '';
        this.showForm = true;
    }

    async openEdit(project: any) {
        this.editing = project;

        // Resolve translations (fallback to raw if not found/not key)
        const resolve = async (val: string) => {
            if (!val || !val.startsWith('proj_')) return val; // Assumption: keys start with proj_
            const translated = await this.supabase.getTranslationValue(val, 'es');
            return translated || val;
        };

        this.form = {
            title: await resolve(project.title || ''),
            description: await resolve(project.description || ''),
            company: project.company || '',
            companyUrl: project.companyUrl || '',
            role: await resolve(project.role || ''),
            images: (project.images || []).join(', '),
            liveUrl: project.liveUrl || '',
            repoUrl: project.repoUrl || '',
            featured: project.featured || false
        };

        // Load Additional Info (Markdown)
        // Check if it's a key or raw text
        const infoVal = project.additional_info || '';
        if (infoVal.startsWith('proj_info_')) {
            // It's a key, load both
            this.additionalInfoES = await this.supabase.getTranslationValue(infoVal, 'es') || '';
            this.additionalInfoEN = await this.supabase.getTranslationValue(infoVal, 'en') || '';
        } else {
            // Raw text (legacy), assume ES
            this.additionalInfoES = infoVal;
            this.additionalInfoEN = '';
        }

        // Load skills
        this.selectedSkillIds.clear();
        this.skillFilter = '';
        const skills = await this.supabase.getProjectSkills(project.id);
        skills.forEach(s => this.selectedSkillIds.add(s.skillId));

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

    private generateKey(prefix: string, text: string): string {
        // Ensure slug is valid for key
        const safeText = text || 'info';
        const slug = safeText.slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '_');
        return `${prefix}_${slug}_${Date.now().toString(36)}`;
    }

    async save() {
        this.saving = true;

        // Helper to process text fields (returns KEY)
        const processField = async (currentKeyOrText: string, prefix: string, originalKey?: string) => {
            if (!currentKeyOrText) return '';

            const isExistingKey = originalKey && originalKey.startsWith('proj_');

            if (isExistingKey) {
                await this.supabase.upsertTranslationValue(originalKey!, 'es', currentKeyOrText);
                return originalKey;
            }

            // Create New Key
            const finalKey = this.generateKey(prefix, currentKeyOrText);
            const { data } = await this.supabase.createKey(finalKey, 'projects');
            if (data) {
                await this.supabase.upsertTranslationValue(data.id, 'es', currentKeyOrText);
                await this.supabase.upsertTranslationValue(data.id, 'en', currentKeyOrText); // Mirror
            }
            return finalKey;
        };

        // Process Additional Info Separately (Dual Language)
        let infoKey = this.editing?.additional_info;
        const infoHasKey = infoKey && infoKey.startsWith('proj_info_');


        if (infoHasKey) {
            // Update existing key
            await this.supabase.upsertTranslationValue(infoKey, 'es', this.additionalInfoES);
            await this.supabase.upsertTranslationValue(infoKey, 'en', this.additionalInfoEN);
        } else {
            // Create new key if we have content
            if (this.additionalInfoES || this.additionalInfoEN) {
                // Generate key based on ES content (or EN if ES missing)
                const baseText = this.additionalInfoES || 'info';
                // Need to use generateKey properly
                const newInfoKey = this.generateKey('proj_info', baseText);

                const { data } = await this.supabase.createKey(newInfoKey, 'projects');
                if (data) {
                    await this.supabase.upsertTranslationValue(data.id, 'es', this.additionalInfoES);
                    await this.supabase.upsertTranslationValue(data.id, 'en', this.additionalInfoEN);
                    infoKey = newInfoKey;
                }
            } else {
                infoKey = null;
            }
        }

        const titleKey = await processField(this.form.title, 'proj_title', this.editing?.title);
        const descKey = await processField(this.form.description, 'proj_desc', this.editing?.description);
        const roleKey = await processField(this.form.role, 'proj_role', this.editing?.role);

        // Refresh translations globally after updates
        const lang = this.translate.currentLang || 'es';
        await this.translate.reloadLang(lang).toPromise();
        const otherLang = lang === 'es' ? 'en' : 'es';
        await this.translate.reloadLang(otherLang).toPromise();
        this.translate.use(lang);

        const data = {
            title: titleKey,
            description: descKey,
            company: this.form.company,
            companyUrl: this.form.companyUrl,
            role: roleKey,
            images: this.toArray(this.form.images),
            liveUrl: this.form.liveUrl,
            repoUrl: this.form.repoUrl,
            featured: this.form.featured,
            additional_info: infoKey,
        };

        let projectId: number | null = null;

        if (this.editing) {
            projectId = this.editing.id;
            await this.supabase.updateProject(projectId!, data);
        } else {
            const res = await this.supabase.createProject(data);
            if (res.data && res.data[0]) {
                projectId = res.data[0].id;
            }
        }

        // Save Skills
        if (projectId) {
            await this.supabase.updateProjectSkills(projectId, Array.from(this.selectedSkillIds));
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

    // Skills Helpers
    get filteredSkills() {
        if (!this.skillFilter) return this.allSkills;
        const filter = this.skillFilter.toLowerCase();
        return this.allSkills.filter(s => {
            const translatedName = this.translate.instant(s.name).toLowerCase();
            return translatedName.includes(filter) || s.name.toLowerCase().includes(filter);
        });
    }

    toggleSkill(id: number) {
        if (this.selectedSkillIds.has(id)) {
            this.selectedSkillIds.delete(id);
        } else {
            this.selectedSkillIds.add(id);
        }
    }

    getSkillName(id: number) {
        return this.allSkills.find(s => s.id === id)?.name || id;
    }
}

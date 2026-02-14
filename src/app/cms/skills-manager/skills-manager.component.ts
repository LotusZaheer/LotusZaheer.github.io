import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-skills-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './skills-manager.component.html',
    styleUrl: './skills-manager.component.scss'
})
export class SkillsManagerComponent implements OnInit {
    categories: any[] = [];
    skills: any[] = [];
    selectedCategory: any = null;

    // Forms
    newCategoryName = '';
    newSkillName = '';
    selectedFile: File | null = null;

    constructor(
        private supabase: SupabaseService,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.loadCategories();
        this.loadSkills();
        // Force refresh translations
        const lang = this.translate.currentLang || 'es';
        this.translate.reloadLang(lang).subscribe(() => this.translate.use(lang));
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    loadCategories() {
        this.supabase.getSkillCategories().subscribe(data => this.categories = data);
    }

    loadSkills() {
        this.supabase.getSkills().subscribe(data => this.skills = data);
    }

    selectCategory(category: any) {
        this.selectedCategory = category;
    }

    get filteredSkills() {
        if (!this.selectedCategory) return this.skills;
        return this.skills.filter(s => s.categoryId === this.selectedCategory.id);
    }

    private generateKey(prefix: string, name: string): string {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const suffix = Date.now().toString(36);
        return `${prefix}_${slug}_${suffix}`;
    }

    async addCategory() {
        if (!this.newCategoryName) return;
        const keyName = this.generateKey('cat', this.newCategoryName);

        // 1. Create Key
        const { data: keyData } = await this.supabase.createKey(keyName, 'skills');

        if (keyData) {
            // 2. Add Initial Value (Both ES and EN for safety)
            await this.supabase.upsertTranslationValue(keyData.id, 'es', this.newCategoryName);
            await this.supabase.upsertTranslationValue(keyData.id, 'en', this.newCategoryName);

            // 3. Create Category with KEY as name
            await this.supabase.createSkillCategory({ name: keyName });

            // Refresh local translations
            const lang = this.translate.currentLang || 'es';
            await this.translate.reloadLang(lang).toPromise();
            this.translate.use(lang);

            this.newCategoryName = '';
            this.loadCategories();
        }
    }

    async deleteCategory(id: number) {
        if (confirm('¿Eliminar categoría y sus habilidades?')) {
            await this.supabase.deleteSkillCategory(id);
            this.loadCategories();
            this.loadSkills();
            this.selectedCategory = null;
        }
    }

    async addSkill() {
        if (!this.newSkillName || !this.selectedCategory) return;
        const keyName = this.generateKey('skill', this.newSkillName);

        // Upload Icon if exists
        let iconUrl = null;
        if (this.selectedFile) {
            iconUrl = await this.supabase.uploadImage(this.selectedFile, 'skills');
        }

        // 1. Create Key
        const { data: keyData } = await this.supabase.createKey(keyName, 'skills');

        if (keyData) {
            // 2. Add Initial Value (Both ES and EN)
            await this.supabase.upsertTranslationValue(keyData.id, 'es', this.newSkillName);
            await this.supabase.upsertTranslationValue(keyData.id, 'en', this.newSkillName);

            // 3. Create Skill with KEY as name and uploaded icon
            await this.supabase.createSkill({
                name: keyName,
                categoryId: this.selectedCategory.id,
                icon: iconUrl
            });

            // Refresh local translations
            const lang = this.translate.currentLang || 'es';
            await this.translate.reloadLang(lang).toPromise();
            this.translate.use(lang);

            this.newSkillName = '';
            this.selectedFile = null;
            this.loadSkills();
        }
    }

    async deleteSkill(id: number) {
        if (confirm('¿Eliminar habilidad?')) {
            await this.supabase.deleteSkill(id);
            this.loadSkills();
        }
    }
}

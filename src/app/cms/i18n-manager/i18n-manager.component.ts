import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-i18n-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './i18n-manager.component.html',
    styleUrl: './i18n-manager.component.scss'
})
export class I18nManagerComponent implements OnInit {
    keys: any[] = [];
    languages: any[] = [];
    translations: { [keyId: string]: { [langCode: string]: string } } = {};

    loading = false;
    savingKey: string | null = null; // Key ID being saved

    // Filters
    pages: string[] = ['home', 'sections', 'skills', 'projects', 'contact', 'about', 'others'];
    selectedPage = 'home';
    newKeyName = '';

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.loadLanguages();
        this.loadKeys(); // Load default page
    }

    async loadLanguages() {
        this.supabase.getLanguages().subscribe(langs => {
            this.languages = langs;
        });
    }

    async loadKeys() {
        this.loading = true;
        this.keys = await this.supabase.getKeys(this.selectedPage);

        // Load values for these keys? 
        // Optimization: Load ALL values for this page?
        // SupabaseService doesn't have "getValuesByKeyIds".
        // I'll just fetch ALL translations for each language and map them in memory?
        // Or fetch dynamic values.
        // Let's iterate languages and fetch all translations for valid cache.
        // Better: `i18n_values` where key_id in (ids).

        // For now, I'll reuse `getTranslations(lang)` for simplicity, but that returns FLAT objects.
        // I need RAW values to edit.
        // I'll add `getRawTranslations(lang)` to service or just query here.
        // Let's just query here for simplicity or add to service if reused.
        // Let's just query here for simplicity or add to service if reused.
        // Querying via service method:
        const allValues = await this.supabase.getAllTranslationValues();

        // Map to dictionary [keyId][langCode] = value

        // Map to dictionary [keyId][langCode] = value
        this.translations = {};
        if (allValues) {
            allValues.forEach((v: any) => {
                if (!this.translations[v.key_id]) this.translations[v.key_id] = {};
                this.translations[v.key_id][v.lang_code] = v.value;
            });
        }

        this.loading = false;
    }

    getValue(keyId: string, langCode: string): string {
        return this.translations[keyId]?.[langCode] || '';
    }

    async updateValue(keyId: string, langCode: string, event: any) {
        const value = event.target.value;
        // Optimistic update
        if (!this.translations[keyId]) this.translations[keyId] = {};
        this.translations[keyId][langCode] = value;

        // Debounce or save on blur? Save on blur/change is safer.
        this.savingKey = keyId;
        await this.supabase.upsertTranslationValue(keyId, langCode, value);
        this.savingKey = null;
    }

    async addKey() {
        if (!this.newKeyName) return;
        const fullKey = this.selectedPage === 'dynamic' ? this.newKeyName : `${this.selectedPage}.${this.newKeyName}`;

        const { data, error } = await this.supabase.createKey(fullKey, this.selectedPage);
        if (data) {
            this.newKeyName = '';
            this.loadKeys();
        } else {
            alert('Error creating key (maybe duplicate?)');
        }
    }

    async deleteKey(keyId: string) {
        if (confirm('¿Estás seguro de que quieres eliminar esta clave? Esta acción no se puede deshacer.')) {
            const { error } = await this.supabase.deleteKey(keyId);
            if (!error) {
                this.loadKeys();
            } else {
                alert('Error al eliminar la clave: ' + error.message);
            }
        }
    }

    filterPage(page: string) {
        this.selectedPage = page;
        this.loadKeys();
    }
}

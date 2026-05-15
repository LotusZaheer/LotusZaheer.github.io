import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupabaseService } from '../../services/supabase.service';

interface FormBullet {
    key: string | null;
    es: string;
    en: string;
}

interface ExperienceForm {
    company: string;
    company_url: string;
    role_es: string;
    role_en: string;
    duration_es: string;
    duration_en: string;
    location_es: string;
    location_en: string;
    description_es: string;
    description_en: string;
    bullets: FormBullet[];
    stack: string;
    is_current: boolean;
    sort_order: number;
}

@Component({
    selector: 'app-experience-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './experience-manager.component.html',
    styleUrl: './experience-manager.component.scss'
})
export class ExperienceManagerComponent implements OnInit {
    items: any[] = [];
    editing: any = null;
    showForm = false;
    loading = false;
    saving = false;

    activeTab: 'es' | 'en' = 'es';

    form: ExperienceForm = this.emptyForm();

    constructor(
        private supabase: SupabaseService,
        private translate: TranslateService
    ) { }

    ngOnInit() { this.load(); }

    private emptyForm(): ExperienceForm {
        return {
            company: '',
            company_url: '',
            role_es: '', role_en: '',
            duration_es: '', duration_en: '',
            location_es: '', location_en: '',
            description_es: '', description_en: '',
            bullets: [],
            stack: '',
            is_current: false,
            sort_order: 0
        };
    }

    load() {
        this.loading = true;
        this.supabase.getExperiences().subscribe(data => {
            this.items = data;
            this.loading = false;
        });
    }

    openNew() {
        this.editing = null;
        this.form = this.emptyForm();
        this.activeTab = 'es';
        this.showForm = true;
    }

    async openEdit(item: any) {
        this.editing = item;
        this.form = {
            company: item.company || '',
            company_url: item.company_url || '',
            role_es: await this.resolveValue(item.role_key, 'es'),
            role_en: await this.resolveValue(item.role_key, 'en'),
            duration_es: await this.resolveValue(item.duration_key, 'es'),
            duration_en: await this.resolveValue(item.duration_key, 'en'),
            location_es: await this.resolveValue(item.location_key, 'es'),
            location_en: await this.resolveValue(item.location_key, 'en'),
            description_es: await this.resolveValue(item.description_key, 'es'),
            description_en: await this.resolveValue(item.description_key, 'en'),
            bullets: await this.resolveBullets(item.bullets_keys || []),
            stack: (item.stack || []).join(', '),
            is_current: !!item.is_current,
            sort_order: item.sort_order || 0
        };
        this.activeTab = 'es';
        this.showForm = true;
    }

    private async resolveValue(key: string | null | undefined, lang: 'es' | 'en'): Promise<string> {
        if (!key) return '';
        const v = await this.supabase.getTranslationValue(key, lang);
        return v || '';
    }

    private async resolveBullets(keys: string[]): Promise<FormBullet[]> {
        const result: FormBullet[] = [];
        for (const k of keys) {
            result.push({
                key: k,
                es: await this.resolveValue(k, 'es'),
                en: await this.resolveValue(k, 'en')
            });
        }
        return result;
    }

    addBullet() {
        this.form.bullets.push({ key: null, es: '', en: '' });
    }

    removeBullet(index: number) {
        this.form.bullets.splice(index, 1);
    }

    moveBullet(index: number, delta: number) {
        const target = index + delta;
        if (target < 0 || target >= this.form.bullets.length) return;
        const [b] = this.form.bullets.splice(index, 1);
        this.form.bullets.splice(target, 0, b);
    }

    cancel() {
        this.showForm = false;
        this.editing = null;
        this.form = this.emptyForm();
    }

    private toArray(val: string): string[] {
        return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
    }

    private generateKey(prefix: string): string {
        const rand = Math.random().toString(36).slice(2, 7);
        return `${prefix}_${Date.now().toString(36)}_${rand}`;
    }

    private async upsertI18n(key: string | null, prefix: string, valueEs: string, valueEn: string): Promise<string | null> {
        const hasContent = (valueEs && valueEs.trim()) || (valueEn && valueEn.trim());
        if (!hasContent && !key) return null;

        const resolvedKey = key || this.generateKey(prefix);
        const keyId = await this.supabase.ensureKey(resolvedKey, 'experience');
        if (!keyId) return null;

        await this.supabase.upsertTranslationValue(keyId, 'es', valueEs || '');
        await this.supabase.upsertTranslationValue(keyId, 'en', valueEn || '');
        return resolvedKey;
    }

    async save() {
        if (!this.form.company.trim()) return;

        this.saving = true;

        const roleKey = await this.upsertI18n(
            this.editing?.role_key || null, 'exp_role',
            this.form.role_es, this.form.role_en
        );
        const durationKey = await this.upsertI18n(
            this.editing?.duration_key || null, 'exp_duration',
            this.form.duration_es, this.form.duration_en
        );
        const locationKey = await this.upsertI18n(
            this.editing?.location_key || null, 'exp_location',
            this.form.location_es, this.form.location_en
        );
        const descriptionKey = await this.upsertI18n(
            this.editing?.description_key || null, 'exp_desc',
            this.form.description_es, this.form.description_en
        );

        const bulletKeys: string[] = [];
        for (const b of this.form.bullets) {
            const k = await this.upsertI18n(b.key, 'exp_bullet', b.es, b.en);
            if (k) bulletKeys.push(k);
        }

        const data = {
            company: this.form.company.trim(),
            company_url: this.form.company_url.trim() || null,
            role_key: roleKey,
            duration_key: durationKey,
            location_key: locationKey,
            description_key: descriptionKey,
            bullets_keys: bulletKeys,
            stack: this.toArray(this.form.stack),
            is_current: this.form.is_current,
            sort_order: Number(this.form.sort_order) || 0,
            updated_at: new Date().toISOString()
        };

        if (this.editing) {
            await this.supabase.updateExperience(this.editing.id, data);
        } else {
            await this.supabase.createExperience(data);
        }

        const lang = this.translate.currentLang || 'es';
        await this.translate.reloadLang(lang).toPromise();
        const otherLang = lang === 'es' ? 'en' : 'es';
        await this.translate.reloadLang(otherLang).toPromise();
        this.translate.use(lang);

        this.saving = false;
        this.cancel();
        this.load();
    }

    async delete(id: number) {
        if (confirm('¿Eliminar esta experiencia laboral? Las claves i18n asociadas no se eliminarán automáticamente.')) {
            await this.supabase.deleteExperience(id);
            this.load();
        }
    }
}

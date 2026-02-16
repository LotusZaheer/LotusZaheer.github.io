import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-resumes-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './resumes-manager.component.html',
    styleUrls: ['./resumes-manager.component.scss']
})
export class ResumesManagerComponent implements OnInit {
    languages: any[] = [];
    loading = false;
    cvUrls: { [langCode: string]: string | null } = {};
    uploading: { [langCode: string]: boolean } = {};

    constructor(private supabase: SupabaseService) { }

    ngOnInit() {
        this.loadLanguages();
    }

    loadLanguages() {
        this.loading = true;
        this.supabase.getLanguages().subscribe(async langs => {
            this.languages = langs;
            await this.loadCurrentCVs();
            this.loading = false;
        });
    }

    async loadCurrentCVs() {
        for (const lang of this.languages) {
            this.cvUrls[lang.code] = await this.supabase.getCVUrl(lang.code);
        }
    }

    async onFileSelected(event: any, langCode: string) {
        const file: File = event.target.files[0];
        if (!file) return;

        this.uploading[langCode] = true;

        try {
            // 1. Upload File
            // Use 'resumes' folder
            const publicUrl = await this.supabase.uploadFile(file, 'resumes');

            if (!publicUrl) {
                alert('Error uploading file');
                return;
            }

            // 2. Save URL to i18n system
            // Ensure key 'cv_url' exists
            const keyId = await this.supabase.ensureKey('cv_url');
            if (!keyId) {
                alert('Error accessing system keys');
                return;
            }

            // Save value
            const { error } = await this.supabase.upsertTranslationValue(keyId, langCode, publicUrl);

            if (error) {
                console.error('Error saving CV URL:', error);
                alert('Error saving CV reference');
            } else {
                // Success
                this.cvUrls[langCode] = publicUrl;
            }

        } catch (e) {
            console.error('Exception uploading CV:', e);
            alert('Unexpected error');
        } finally {
            this.uploading[langCode] = false;
            // Reset input
            event.target.value = '';
        }
    }
}

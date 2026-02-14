import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-social-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './social-manager.component.html',
    styleUrl: './social-manager.component.scss'
})
export class SocialManagerComponent implements OnInit {
    items: any[] = [];
    editing: any = null;
    showForm = false;
    loading = false;
    saving = false;

    form = { name: '', nick: '', iconPath: '', url: '', icon: '' };

    constructor(private supabase: SupabaseService) { }

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.supabase.getSocialNetworks().subscribe(data => {
            this.items = data;
            this.loading = false;
        });
    }

    async onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.saving = true;
        const url = await this.supabase.uploadImage(file, 'social');
        if (url) {
            this.form.icon = url;
        }
        this.saving = false;
    }

    openNew() {
        this.editing = null;
        this.form = { name: '', nick: '', iconPath: '', url: '', icon: '' };
        this.showForm = true;
    }

    openEdit(item: any) {
        this.editing = item;
        this.form = {
            name: item.name,
            nick: item.nick || '',
            iconPath: item.iconPath || '',
            url: item.url || '',
            icon: item.icon || ''
        };
        this.showForm = true;
    }

    cancel() {
        this.showForm = false;
        this.editing = null;
    }

    async save() {
        if (!this.form.name) return;

        this.saving = true;
        if (this.editing) {
            await this.supabase.updateSocialNetwork(this.editing.id, this.form);
        } else {
            await this.supabase.createSocialNetwork(this.form);
        }
        this.saving = false;
        this.cancel();
        this.load();
    }

    async delete(id: number) {
        if (confirm('¿Eliminar esta red social?')) {
            await this.supabase.deleteSocialNetwork(id);
            this.load();
        }
    }
}

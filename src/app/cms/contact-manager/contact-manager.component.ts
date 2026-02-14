import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-contact-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact-manager.component.html',
    styleUrl: './contact-manager.component.scss'
})
export class ContactManagerComponent implements OnInit {
    items: any[] = [];
    editing: any = null;
    showForm = false;
    loading = false;
    saving = false;

    form = { name: '', nick: '', iconPath: '', url: '' };

    constructor(private supabase: SupabaseService) { }

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.supabase.getContactMethods().subscribe(data => {
            this.items = data;
            this.loading = false;
        });
    }

    openNew() {
        this.editing = null;
        this.form = { name: '', nick: '', iconPath: '', url: '' };
        this.showForm = true;
    }

    openEdit(item: any) {
        this.editing = item;
        this.form = { name: item.name, nick: item.nick || '', iconPath: item.iconPath || '', url: item.url || '' };
        this.showForm = true;
    }

    cancel() {
        this.showForm = false;
        this.editing = null;
    }

    async save() {
        this.saving = true;
        if (this.editing) {
            await this.supabase.updateContactMethod(this.editing.id, this.form);
        } else {
            await this.supabase.createContactMethod(this.form);
        }
        this.saving = false;
        this.cancel();
        this.load();
    }

    async delete(id: number) {
        if (confirm('¿Eliminar este método de contacto?')) {
            await this.supabase.deleteContactMethod(id);
            this.load();
        }
    }
}

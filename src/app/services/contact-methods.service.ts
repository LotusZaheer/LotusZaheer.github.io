import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class ContactMethodsService {
  constructor(private supabase: SupabaseClientProvider) { }

  getContactMethods(): Observable<any[]> {
    return from(
      this.supabase.client.from('contact_methods').select('*').order('id', { ascending: true })
    ).pipe(map(response => response.data || []));
  }

  async createContactMethod(data: any) {
    return this.supabase.client.from('contact_methods').insert(data).select();
  }

  async updateContactMethod(id: number, data: any) {
    return this.supabase.client.from('contact_methods').update(data).eq('id', id);
  }

  async deleteContactMethod(id: number) {
    return this.supabase.client.from('contact_methods').delete().eq('id', id);
  }
}

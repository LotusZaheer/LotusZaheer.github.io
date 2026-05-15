import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  constructor(private supabase: SupabaseClientProvider) { }

  getExperiences(): Observable<any[]> {
    return from(
      this.supabase.client
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
    ).pipe(map(response => response.data || []));
  }

  async createExperience(data: any) {
    return this.supabase.client.from('experiences').insert(data).select();
  }

  async updateExperience(id: number, data: any) {
    return this.supabase.client.from('experiences').update(data).eq('id', id);
  }

  async deleteExperience(id: number) {
    return this.supabase.client.from('experiences').delete().eq('id', id);
  }
}

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  constructor(private supabase: SupabaseClientProvider) { }

  getSkillCategories(): Observable<any[]> {
    return from(
      this.supabase.client.from('skill_categories').select('*').order('displayOrder', { ascending: true })
    ).pipe(map(response => response.data || []));
  }

  async createSkillCategory(data: any) {
    return this.supabase.client.from('skill_categories').insert(data).select();
  }

  async deleteSkillCategory(id: number) {
    return this.supabase.client.from('skill_categories').delete().eq('id', id);
  }

  getSkills(): Observable<any[]> {
    return from(
      this.supabase.client.from('skills').select('*, skill_categories(name)').order('name', { ascending: true })
    ).pipe(map(response => response.data || []));
  }

  async createSkill(data: any) {
    return this.supabase.client.from('skills').insert(data).select();
  }

  async deleteSkill(id: number) {
    return this.supabase.client.from('skills').delete().eq('id', id);
  }
}

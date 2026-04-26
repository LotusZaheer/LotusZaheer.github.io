import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private supabase: SupabaseClientProvider) { }

  getProjects(): Observable<any[]> {
    return from(this.supabase.client.from('projects').select(`
      *,
      project_skills (
        skills (
          id,
          name,
          icon,
          skill_categories (
            name,
            "displayOrder"
          )
        )
      )
    `).order('created_at', { ascending: false })).pipe(
      map(response => response.data || [])
    );
  }

  async createProject(project: any) {
    return this.supabase.client.from('projects').insert(project).select();
  }

  async updateProject(id: number, project: any) {
    return this.supabase.client.from('projects').update(project).eq('id', id);
  }

  async deleteProject(id: number) {
    return this.supabase.client.from('projects').delete().eq('id', id);
  }

  async getProjectSkills(projectId: number): Promise<any[]> {
    const { data, error } = await this.supabase.client
      .from('project_skills')
      .select('skillId, skills(*, skill_categories(*))')
      .eq('projectId', projectId);

    if (error) {
      console.error('Error fetching project skills:', error);
      return [];
    }
    return data || [];
  }

  async updateProjectSkills(projectId: number, skillIds: number[]): Promise<boolean> {
    const { error: deleteError } = await this.supabase.client
      .from('project_skills')
      .delete()
      .eq('projectId', projectId);

    if (deleteError) {
      console.error('Error clearing project skills:', deleteError);
      return false;
    }

    if (skillIds.length === 0) return true;

    const inserts = skillIds.map(skillId => ({ projectId, skillId }));

    const { error: insertError } = await this.supabase.client
      .from('project_skills')
      .insert(inserts);

    if (insertError) {
      console.error('Error inserting project skills:', insertError);
      return false;
    }

    return true;
  }
}

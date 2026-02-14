import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private session: any = null;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    // Recover session
    this.supabase.auth.getSession().then(({ data }) => {
      this.session = data.session;
    });

    // Listen for changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session = session;
    });
  }

  // --- Auth ---
  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      this.session = data.session;
      return true;
    } catch (e) {
      console.error('Login exception:', e);
      return false;
    }
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.session = null;
  }

  isAuthenticated(): boolean {
    return !!this.session;
  }

  async refreshSession(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    this.session = data.session;
    return !!this.session;
  }

  // --- Projects ---
  getProjects(): Observable<any[]> {
    return from(this.supabase.from('projects').select(`
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
    return this.supabase.from('projects').insert(project).select();
  }

  async updateProject(id: number, project: any) {
    return this.supabase.from('projects').update(project).eq('id', id);
  }

  async deleteProject(id: number) {
    return this.supabase.from('projects').delete().eq('id', id);
  }

  // --- Social Networks ---
  getSocialNetworks(): Observable<any[]> {
    return from(this.supabase.from('social_networks').select('*').order('id', { ascending: true })).pipe(
      map(response => response.data || [])
    );
  }

  async createSocialNetwork(data: any) {
    return this.supabase.from('social_networks').insert(data).select();
  }

  async updateSocialNetwork(id: number, data: any) {
    return this.supabase.from('social_networks').update(data).eq('id', id);
  }

  async deleteSocialNetwork(id: number) {
    return this.supabase.from('social_networks').delete().eq('id', id);
  }

  // --- Contact Methods ---
  getContactMethods(): Observable<any[]> {
    return from(this.supabase.from('contact_methods').select('*').order('id', { ascending: true })).pipe(
      map(response => response.data || [])
    );
  }

  async createContactMethod(data: any) {
    return this.supabase.from('contact_methods').insert(data).select();
  }

  async updateContactMethod(id: number, data: any) {
    return this.supabase.from('contact_methods').update(data).eq('id', id);
  }

  async deleteContactMethod(id: number) {
    return this.supabase.from('contact_methods').delete().eq('id', id);
  }

  // --- Storage (Images) ---
  async uploadImage(file: File, folder: string = 'projects'): Promise<string | null> {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase.storage.from('portfolio-assets').upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrlData } = this.supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }

  // --- Skill Categories ---
  getSkillCategories(): Observable<any[]> {
    return from(this.supabase.from('skill_categories').select('*').order('displayOrder', { ascending: true })).pipe(
      map(response => response.data || [])
    );
  }

  async createSkillCategory(data: any) {
    return this.supabase.from('skill_categories').insert(data).select();
  }

  async deleteSkillCategory(id: number) {
    return this.supabase.from('skill_categories').delete().eq('id', id);
  }

  // --- Skills ---
  getSkills(): Observable<any[]> {
    return from(this.supabase.from('skills').select('*, skill_categories(name)').order('name', { ascending: true })).pipe(
      map(response => response.data || [])
    );
  }

  async createSkill(data: any) {
    return this.supabase.from('skills').insert(data).select();
  }

  async deleteSkill(id: number) {
    return this.supabase.from('skills').delete().eq('id', id);
  }

  // --- Project Skills ---
  async getProjectSkills(projectId: number): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('project_skills')
      .select('skill_id, skills(*, skill_categories(*))')
      .eq('projectId', projectId);

    if (error) {
      console.error('Error fetching project skills:', error);
      return [];
    }
    return data || [];
  }

  async updateProjectSkills(projectId: number, skillIds: number[]) {
    // 1. Delete existing skills for this project
    const { error: deleteError } = await this.supabase
      .from('project_skills')
      .delete()
      .eq('projectId', projectId);

    if (deleteError) {
      console.error('Error clearing project skills:', deleteError);
      return false;
    }

    if (skillIds.length === 0) return true;

    // 2. Insert new skills
    const inserts = skillIds.map(skillId => ({
      projectId,
      skillId
    }));

    const { error: insertError } = await this.supabase
      .from('project_skills')
      .insert(inserts);

    if (insertError) {
      console.error('Error inserting project skills:', insertError);
      return false;
    }

    return true;
  }

  // --- i18n ---
  getLanguages(): Observable<any[]> {
    return from(this.supabase.from('languages').select('*').order('code')).pipe(
      map(res => res.data || [])
    );
  }

  getTranslations(langCode: string): Observable<any> {
    const lang = langCode.split('-')[0].toLowerCase();
    // Fetch values joined with keys
    // Result: [ { value: 'Hola', i18n_keys: { key_name: 'home.greeting' } } ]
    return from(
      this.supabase.from('i18n_values')
        .select(`
          value,
          i18n_keys!inner (
            key_name
          )
        `)
        .eq('lang_code', lang)
    ).pipe(
      map(res => {
        const data = res.data || [];
        const result: any = {};

        data.forEach((item: any) => {
          if (item.i18n_keys && item.i18n_keys.key_name) {
            result[item.i18n_keys.key_name] = item.value;
          }
        });
        return result;
      })
    );
  }

  // Admin / CMS methods
  async getAllTranslationValues() {
    const { data } = await this.supabase.from('i18n_values').select('*');
    return data || [];
  }

  async getKeys(pageFilter?: string): Promise<any[]> {
    let query = this.supabase.from('i18n_keys').select('*').order('key_name');
    if (pageFilter) {
      query = query.eq('page', pageFilter);
    }
    const { data } = await query;
    return data || [];
  }

  async createKey(keyName: string, page: string = 'dynamic') {
    return this.supabase.from('i18n_keys').insert({ key_name: keyName, page }).select().single();
  }

  async upsertTranslationValue(keyId: string, langCode: string, value: string) {
    // Check if exists? Or use upsert with unique constraint constraint key_id+lang_code
    return this.supabase.from('i18n_values').upsert({
      key_id: keyId,
      lang_code: langCode,
      value
    }, { onConflict: 'key_id, lang_code' });
  }

  async getTranslationValue(keyName: string, langCode: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('i18n_values')
      .select('value, i18n_keys!inner(key_name)')
      .eq('i18n_keys.key_name', keyName)
      .eq('lang_code', langCode)
      .maybeSingle();

    return data ? data.value : null;
  }
}

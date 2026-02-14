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
        persistSession: false, // Avoids local storage lock issues, but login is lost on refresh
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    // Recover session if exists (only works if persistSession is true, but we keep it false for stability as requested)
    // For now, we rely on in-memory session.
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

  isAuthenticated(): boolean {
    return !!this.session;
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.session = null;
  }

  // --- Projects ---
  getProjects(): Observable<any[]> {
    return from(this.supabase.from('projects').select('*').order('id', { ascending: true })).pipe(
      map(response => response.data || [])
    );
  }

  async createProject(project: any) {
    return this.supabase.from('projects').insert(project);
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
    return this.supabase.from('social_networks').insert(data);
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
    return this.supabase.from('contact_methods').insert(data);
  }

  async updateContactMethod(id: number, data: any) {
    return this.supabase.from('contact_methods').update(data).eq('id', id);
  }

  async deleteContactMethod(id: number) {
    return this.supabase.from('contact_methods').delete().eq('id', id);
  }

  // --- Storage (Images) ---
  async uploadImage(file: File): Promise<string | null> {
    const fileName = `projects/${Date.now()}_${file.name}`;
    const { data, error } = await this.supabase.storage.from('portfolio-assets').upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrlData } = this.supabase.storage.from('portfolio-assets').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }
}

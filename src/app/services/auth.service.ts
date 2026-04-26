import { Injectable } from '@angular/core';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: SupabaseClientProvider) { }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.client.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      this.supabase.setSession(data.session);
      return true;
    } catch (e) {
      console.error('Login exception:', e);
      return false;
    }
  }

  async signOut(): Promise<void> {
    await this.supabase.client.auth.signOut();
    this.supabase.setSession(null);
  }

  isAuthenticated(): boolean {
    return !!this.supabase.session;
  }

  async refreshSession(): Promise<boolean> {
    const { data } = await this.supabase.client.auth.getSession();
    this.supabase.setSession(data.session);
    return !!data.session;
  }
}

import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientProvider {
  readonly client: SupabaseClient;
  private currentSession: Session | null = null;

  constructor() {
    this.client = createClient(environment.supabase.url, environment.supabase.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    this.client.auth.getSession().then(({ data }) => {
      this.currentSession = data.session;
    });

    this.client.auth.onAuthStateChange((_event, session) => {
      this.currentSession = session;
    });
  }

  get session(): Session | null {
    return this.currentSession;
  }

  setSession(session: Session | null): void {
    this.currentSession = session;
  }
}

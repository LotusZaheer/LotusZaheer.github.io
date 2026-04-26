import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class SocialNetworksService {
  constructor(private supabase: SupabaseClientProvider) { }

  getSocialNetworks(): Observable<any[]> {
    return from(
      this.supabase.client.from('social_networks').select('*').order('id', { ascending: true })
    ).pipe(map(response => response.data || []));
  }

  async createSocialNetwork(data: any) {
    return this.supabase.client.from('social_networks').insert(data).select();
  }

  async updateSocialNetwork(id: number, data: any) {
    return this.supabase.client.from('social_networks').update(data).eq('id', id);
  }

  async deleteSocialNetwork(id: number) {
    return this.supabase.client.from('social_networks').delete().eq('id', id);
  }
}

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseClientProvider } from './supabase-client.provider';

@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private supabase: SupabaseClientProvider) { }

  getLanguages(): Observable<any[]> {
    return from(this.supabase.client.from('languages').select('*').order('code')).pipe(
      map(res => res.data || [])
    );
  }

  getTranslations(langCode: string): Observable<any> {
    const lang = langCode.split('-')[0].toLowerCase();
    return from(
      this.supabase.client.from('i18n_values')
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

  async getAllTranslationValues() {
    const { data } = await this.supabase.client.from('i18n_values').select('*');
    return data || [];
  }

  async getKeys(pageFilter?: string): Promise<any[]> {
    let query = this.supabase.client.from('i18n_keys').select('*').order('key_name');
    if (pageFilter) {
      query = query.eq('page', pageFilter);
    }
    const { data } = await query;
    return data || [];
  }

  async createKey(keyName: string, page: string = 'dynamic') {
    return this.supabase.client.from('i18n_keys').insert({ key_name: keyName, page }).select().single();
  }

  async deleteKey(keyId: string) {
    return this.supabase.client.from('i18n_keys').delete().eq('id', keyId);
  }

  async upsertTranslationValue(keyId: string, langCode: string, value: string) {
    return this.supabase.client.from('i18n_values').upsert({
      key_id: keyId,
      lang_code: langCode,
      value
    }, { onConflict: 'key_id, lang_code' });
  }

  async getTranslationValue(keyName: string, langCode: string): Promise<string | null> {
    const { data } = await this.supabase.client
      .from('i18n_values')
      .select('value, i18n_keys!inner(key_name)')
      .eq('i18n_keys.key_name', keyName)
      .eq('lang_code', langCode)
      .maybeSingle();

    return data ? data.value : null;
  }

  async ensureKey(keyName: string, page: string = 'system'): Promise<string | null> {
    const { data } = await this.supabase.client
      .from('i18n_keys')
      .select('id')
      .eq('key_name', keyName)
      .maybeSingle();

    if (data) return data.id;

    const { data: newKey, error } = await this.supabase.client
      .from('i18n_keys')
      .insert({ key_name: keyName, page })
      .select()
      .single();

    if (error) {
      console.error('Error ensuring key:', error);
      return null;
    }
    return newKey.id;
  }

  async getCVUrl(langCode: string): Promise<string | null> {
    return this.getTranslationValue('cv_url', langCode);
  }
}

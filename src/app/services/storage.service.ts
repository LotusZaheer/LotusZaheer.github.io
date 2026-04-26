import { Injectable } from '@angular/core';
import { SupabaseClientProvider } from './supabase-client.provider';

const BUCKET = 'portfolio-assets';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private supabase: SupabaseClientProvider) { }

  async uploadImage(file: File, folder: string = 'projects'): Promise<string | null> {
    return this.upload(file, folder);
  }

  async uploadFile(file: File, folder: string = 'resumes'): Promise<string | null> {
    return this.upload(file, folder);
  }

  private async upload(file: File, folder: string): Promise<string | null> {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await this.supabase.client.storage.from(BUCKET).upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: publicUrlData } = this.supabase.client.storage.from(BUCKET).getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  }
}

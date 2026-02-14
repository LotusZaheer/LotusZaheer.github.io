import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SupabaseTranslationLoader implements TranslateLoader {
    constructor(private supabase: SupabaseService) { }

    getTranslation(lang: string): Observable<any> {
        return this.supabase.getTranslations(lang).pipe(
            map(flat => this.unflatten(flat))
        );
    }

    private unflatten(data: { [key: string]: string }): any {
        const result: any = {};
        for (const i in data) {
            const keys = i.split('.');
            keys.reduce((acc, cur, j) => {
                return acc[cur] || (acc[cur] = (keys[j + 1] === undefined ? data[i] : {}));
            }, result);
        }
        return result;
    }
}
